import { response } from "express";
import { ProdutoModelo } from "../../models/produto/produtoModelo";
import { conn,db_publico } from "../../database/databaseConfig";
import { ProdutoBling } from "../../interfaces/produtoBling";
import ConfigApi from "../../Services/api";
import { ProdutoApi } from "../../models/produtoApi/produtoApi";
// import { api } from "../../Services/api";


export class ProdutoController {


    
    async enviaProduto() {
        const  api:any = new ConfigApi();
        const produto = new ProdutoModelo();
        const produtoApi = new ProdutoApi();

        const produtos: any = await produto.buscaProdutos(conn, db_publico);


        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

            async function envio(){
                for (const data of produtos ){

                    const aux: ProdutoBling = {
                                    codigo: data.CODIGO,
                                    nome: data.DESCRICAO,
                                    descricaoCurta: data.DESCR_CURTA,
                                    descricaoComplementar: data.DESCR_LONGA,
                                    tipo: 'P',
                                    unidade: 'un',
                                    preco: 1,
                                    pesoBruto: 1,
                                    formato: 'S',
                                    largura: data.LARGURA,
                                    altura: data.ALTURA,
                                    profundidade: data.COMPRIMENTO,
                                    dimensoes: { altura: data.ALTURA, largura: data.LARGURA, profundidade: data.COMPRIMENTO },
                                    tributacao: { cest: '', ncm: '' }
                                };

                                try {
                                     const response = await api.config.post('/produtos', aux);
                        
                               const produtoEnviado = {
                                              id_bling : response.data.data.id,
                                              codigo_sistema : data.CODIGO
                                                     }

                                        try{
                                          let prod =  await produtoApi.inserir(produtoEnviado);
                                             console.log(prod) ;    
                                            }catch(error){ console.log("erro ao cadastrar no banoc api "+error)}
                                    } catch (error: any) {
                                        if (error.response) {
                                            console.log('Status:', error.response.status);
                                            console.log('Data:', error.response.data.error);
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


                const produtosEnviados:any = await produtoApi.busca();

                for(const data of produtosEnviados){
                          const resultSaldo:any = await  produto.buscaEstoqueReal(data.codigo_sistema);
                          const saldoReal = resultSaldo[0].ESTOQUE;
                        
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