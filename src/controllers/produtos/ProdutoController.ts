import { Response, Request } from "express";
import { ProdutoModelo } from "../../models/produto/produtoModelo";
import { conn,db_publico } from "../../database/databaseConfig";
import { ProdutoBling } from "../../interfaces/produtoBling";
import ConfigApi from "../../Services/api";
import { ProdutoApi } from "../../models/produtoApi/produtoApi";
// import { api } from "../../Services/api";

export class ProdutoController {


    
    async enviaProduto( req:Request, res:Response) {
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

    

                            let preco:any = 0
                        try{
                                const result:any = await produto.buscaPreco(data.CODIGO, tabelaSelecionada); 
                                    if(result[0].preco !== undefined || result[0].preco !== null){
                                        preco = result[0].preco
                                        //console.log(preco)
                                    }
                            }catch(err){ console.log("erro ao obter tabela de preco para o produto: " +data.CODIGO)}


                    //busca ncm
                    let queryNcm:any =[];
                         try{
                             queryNcm  = await produto.buscaNcm(data.CLASS_FISCAL);
                    }catch(err){ console.log('erro ao obter o ncm do produto')}

                    let ncm 
                        let cod_cest 

                        
                    if( queryNcm.length > 0){
                        ncm    = queryNcm[0].ncm;
                        cod_cest   = queryNcm[0].cod_cest;
                        }else{
                            ncm    =  null ;
                            cod_cest   =  null;
                        }
                        


                    const post: ProdutoBling = {
                                    codigo: data.CODIGO,
                                    nome: data.DESCRICAO,
                                    descricaoCurta: data.DESCR_CURTA,
                                    descricaoComplementar: data.DESCR_LONGA,
                                    tipo: 'P',
                                    unidade: 'un',
                                    preco: preco,
                                    pesoBruto: 1,
                                    formato: 'S',
                                    largura: data.LARGURA,
                                    altura: data.ALTURA,
                                    profundidade: data.COMPRIMENTO,
                                    dimensoes: { altura: data.ALTURA, largura: data.LARGURA, profundidade: data.COMPRIMENTO },
                                    tributacao: { cest: cod_cest, ncm: ncm, }
                                };

//atualiza caso ja tenha sido enviado 
                 if(produtoSincronizado.length > 0 ){
                                    
                                    //return console.log('produto ja foi enviado ')
                                    const id = produtoSincronizado[0].Id_bling;

                                    const put:any = { 
                                    id: id,
                                    codigo:data.CODIGO,
                                    nome: data.DESCRICAO,
                                    descricaoCurta: data.DESCR_CURTA,
                                    descricaoComplementar: data.DESCR_LONGA,
                                    tipo: 'P',
                                    unidade: 'un',
                                    preco: preco,
                                    pesoBruto: 1,
                                    formato: 'S',
                                    largura: data.LARGURA,
                                    altura: data.ALTURA,
                                    profundidade: data.COMPRIMENTO,
                                    dimensoes: { altura: data.ALTURA, largura: data.LARGURA, profundidade: data.COMPRIMENTO },
                                    tributacao: { cest: cod_cest, ncm: ncm, }
                                    }
                                                try{
                                                    const response = await api.config.put(`/produtos/${id}`,put)
                                                    console.log(response.status,"atualizado com sucesso!")
                                                    
                                                }catch(err){}
                   }else{

                                    try {
                                        const response = await api.config.post('/produtos', post);
                                        //console.log(post);
                                         const produtoEnviado = {
                                                id_bling : response.data.data.id,
                                                codigo_sistema : data.CODIGO,
                                                 descricao: data.DESCRICAO
                                                         }
                                                
                                             try{
                                                      let prod =  await produtoApi.inserir(produtoEnviado);
                                               }catch(error){ 
                                                 console.log("erro ao cadastrar no banco da api "+error)
                                             }
                                              if(response.status ===200 || response.status ===201   && produtoSelecionado !== '*'){
                                                  //return console.log( "produto enviado com sucesso");
                                                  return res.json({"msg":"produto enviado com sucesso!"});
                                                }   

                                        } catch (error: any) {
                                          if (error.response) {
                                            console.log('Status:', error.response.data);
                                            const v:any = error.response.data.error.fields[0].msg
                                            
                                            if( produtoSelecionado !== '*' ){
                                              return res.json({"msg":v});
                                            }
                                              //return console.log(v) ;
                                            }
                                     }
                          }
                                 
                    await delay(3000);
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
                                const estoqueEnviado = await api.config.post('/estoques', estoque);
                                console.log(estoqueEnviado.data);
                            }catch(err){
                                    console.log(err + "erro ao enviar o estoque ")
                                }
                                await delay(3000);
                
                            }


       }catch( error ){
                 console.log(error )
                 }

    }


}