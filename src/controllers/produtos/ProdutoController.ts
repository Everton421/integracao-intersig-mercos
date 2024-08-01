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

        console.log(parseInt(req.body.produto));
        console.log("");
        console.log("");

       const  produtoSelecionado:any =  parseInt(req.body.produto);
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
                    try{
                     produtos  = await produto.buscaProduto(produtoSelecionado);
                    }catch(err){ console.log(`erro ao consultar o produto ${produtoSelecionado} `)}
                    }
                
                if(produtos.length > 0 ){
                 
                for (const data of produtos ){
                    

                    const produtoSincronizado:any = await produtoApi.busca(data.CODIGO);

                    

                 if(produtoSincronizado.length > 0 ){
                    console.log(`produto ${data.CODIGO} ja foi enviado  `);
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

                            console.log(produtoSemVinculo.data.data.length);
                         if( produtoSemVinculo.data.data.length > 0 ){

                            const produtoEnviado = {
                                                  id_bling : produtoSemVinculo.data.data[0].id,
                                                  codigo_sistema : data.CODIGO,
                                                   descricao: data.DESCRICAO
                                                           }
                                        
                                               try{
                                                      
                                                        let prod:any =  await produtoApi.inserir(produtoEnviado);
                                                            if(prod.affectedRows === 1){
                                                                console.log(`gerado vinculo para o produto ${data.CODIGO}`);
                                                                res.json({'msg': `gerado vinculo para o produto ${data.CODIGO}`})
                                                            }else{
                                                             res.json({'msg': `erro ao gerar vinculo para o produto ${data.CODIGO}`})
                                                            console.log(prod);

                                                            }
                                                     
                                       
                                                 }catch(error){ 
                                                   res.json({'msg': `erro ao gerar vinculo para o produto ${data.CODIGO}`})
                                               }

                         }else{ 
                                              res.json({'msg': `o produto ${data.CODIGO} nao foi encontrado no bling`})

                        }
                            
                          }
                                 
                    await delay(2000);
                }
            } else{
                console.log("produto invalido!");
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
            
             if(!deposito.data.data){
                console.log("nao encontrado deposito no bling");
             }

             const idDeposito = deposito.data.data[0].id;

                    

                const produtosEnviados:any = await produtoApi.buscaTodos();
                if(produtosEnviados.length > 0 ){

                for(const data of produtosEnviados){
                          const resultSaldo:any = await  produto.buscaEstoqueReal(data.codigo_sistema);

                    let saldo_enviado =  data.saldo_enviado;
                            

                          let saldoReal;
                          if(resultSaldo.length > 0  ){
                            saldoReal = resultSaldo[0].ESTOQUE;
                          }else{
                            saldoReal = 0;
                          }

                          if( saldo_enviado !== saldoReal ){
                            
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

                                          console.log(estoqueEnviado.status);
                                            
                                          if(status !== 201){
                                            
                                            while(status !== 201 || status !== 200){
                                                await delay(2000);
                                               console.log(` aguardando para enviar saldo para o produto ${data.codigo_sistema}...`)
                                                estoqueEnviado =  await api.config.post('/estoques', estoque);
                                               
                                                status = estoqueEnviado.status
                                                
                                                if(status === 201 || status ===200){
                                                    await produtoApi.atualizaSaldoEnviado(data.Id_bling,saldoReal);
                                                    console.log(estoqueEnviado.data);    
                                                    console.log(` enviado saldo para produto: ${data.codigo_sistema }   saldo: ${saldoReal}  idBling: ${ data.Id_bling} `);
                                                }
                                                
                                            }

                                            }else{
                                                console.log(` enviado saldo para produto: ${data.codigo_sistema }   saldo: ${saldoReal}  idBling: ${ data.Id_bling} `);
                                                await produtoApi.atualizaSaldoEnviado(data.Id_bling,saldoReal);
                                            }
                                                    

                                                    
                                         }catch(err){
                                            console.log(estoque);
                                                console.log(err + ` erro ao enviar o estoque para o produto ${data.codigo_sistema} `);
                                            
                                            }
                                            await delay(2000);
                                        
                                        }else{

                                            console.log(`ultimo saldo enviado para o produto ${data.codigo_sistema} igual ao saldo atual, saldo nao enviado`);
                                        }
                                 }
                        
                        }
                            console.log('fim do processo')

       }catch( error ){
                 console.log(error )
                 }

    }



}
