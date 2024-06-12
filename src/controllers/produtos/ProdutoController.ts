import { Response, Request } from "express";
import { ProdutoModelo } from "../../models/produto/produtoModelo";
import { conn,db_publico } from "../../database/databaseConfig";
import { ProdutoBling } from "../../interfaces/produtoBling";
import ConfigApi from "../../Services/api";
import { ProdutoApi } from "../../models/produtoApi/produtoApi";
import { imgController } from "../imgBB/imgController";
import { categoriaController } from "../categoria/categoriaController";
import { verificaTokenTarefas } from "../../Middlewares/TokenMiddleware";
// import { api } from "../../Services/api";

export class ProdutoController {


    
    async enviaProduto( req:Request, res:Response) {
        const categoriacontroller = new categoriaController();

       const  produtoSelecionado:any =  req.body.produto;
       const tabelaSelecionada:any = req.body.tabela; 

        const  api:any = new ConfigApi();
        const produto = new ProdutoModelo();
        const produtoApi = new ProdutoApi();


        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

            async function envio(){
               
                let produtos:any =[];

                if(produtoSelecionado === '*' ){
                     produtos  = await produto.buscaProdutos();
                     console.log(produtoSelecionado)
                }else{
                     produtos  = await produto.buscaProduto(produtoSelecionado);
                }
        
                for (const data of produtos ){
                   
                    const produtoSincronizado:any = await produtoApi.busca(data.CODIGO);

                    

                 if(produtoSincronizado.length > 0 ){
                                    
                                                 return    res.json({'msg': `produto ${data.CODIGO} ja foi enviado`})
                                                     // console.log(`produto ${data.CODIGO} ja foi enviado  `)
       
                    }else{
                            let produtoSemVinculo:any = [];
                            let codErp:any= data.CODIGO;

                            try{
                                 
                                produtoSemVinculo = await api.config.get('/produtos',{
                                    params: { 
                                        pagina: 1,
                                        limite: 100,
                                        criterio: 2,
                                        tipo: 'P',
                                        codigo: codErp
                                    }
                                } )
                            }catch(err){}


                         if( produtoSemVinculo.data.data.length > 0 ){

                            const produtoEnviado = {
                                                  id_bling : produtoSemVinculo.data.data[0].id,
                                                  codigo_sistema : data.CODIGO,
                                                   descricao: data.DESCRICAO
                                                           }
                                        
                                               try{
                                                        let prod =  await produtoApi.inserir(produtoEnviado);
                                        res.json({'msg': `gerado vinculo para o produto ${data.CODIGO}`})

                                                 }catch(error){ 
                                                  //  res.json({'msg': `erro ao gerar vinculo para o produto ${data.CODIGO}`})
                                               }

                         }else{ 
                                                    res.json({'msg': `o produto ${data.CODIGO} nao foi encontrado no bling`})

                        }
                            
                          }
                                 
                    await delay(2000);
                }
                return ;
            }
            try{
                envio();
            }catch(err){
                console.log(err);
            }

    }


    async enviaEstoque(){
        await verificaTokenTarefas();
        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

                    const  api:any = new ConfigApi();

                    const produtoApi = new ProdutoApi();

                    const produto = new ProdutoModelo();

        try{
            await api.configurarApi(); // Aguarda a configuração da API
                
             const deposito = await api.config.get('/depositos');
            const idDeposito = deposito.data.data[0].id;

                const produtosEnviados:any = await produtoApi.buscaTodos();

                for(const data of produtosEnviados){
                          const resultSaldo:any = await  produto.buscaEstoqueReal(data.codigo_sistema);

                          let saldoReal;
                          if(resultSaldo.length > 0  ){
                            saldoReal = resultSaldo[0].ESTOQUE;
                          }else{
                            saldoReal = 0;
                          }
                        
                        let estoque=  {
                            "produto": {
                              "id": data.Id_bling
                            },
                            "deposito": {
                              "id": idDeposito
                            },
                            "operacao": "B",
                            "preco": 0,
                            "custo": 0,
                            "quantidade": saldoReal,
                            "observacoes": ""
                          }

                            try{
                                let status;
                                let estoqueEnviado;
                                  estoqueEnviado = await api.config.post('/estoques', estoque);
                                status = estoqueEnviado.status

                              //  console.log(estoqueEnviado.data);

                                 if( status !== 201){
                                await delay(500);
                                    console.log(`erro ao enviar saldo tentando enviar novamente ${status} `)  
                                    estoqueEnviado =  await api.config.post('/estoques', estoque);
                                    console.log(estoqueEnviado.data);    
                                }
                                console.log(estoqueEnviado.data);    
                                console.log(` enviado saldo para produto: ${data.codigo_sistema }   saldo: ${saldoReal}  idBling: ${ data.Id_bling} `
                                );
                            }catch(err){
                                console.log(estoque);
                                    console.log(err + ` erro ao enviar o estoque para o produto ${data.codigo_sistema} `);
                                
                                }
                                await delay(500);
                
                            }
                            console.log('fim do processo')

       }catch( error ){
                 console.log(error )
                 }

    }



}
