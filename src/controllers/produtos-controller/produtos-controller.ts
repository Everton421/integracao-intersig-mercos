
import { Response, Request } from "express";
import { ProdutoApiRepository } from "../../dataAcess/api-produto-repository/produto-api-repository";
import { ProdutoMapper } from "../../mappers/produto-mapper";
import { CategoriaApiRepository } from "../../dataAcess/api-categoria-repository/categoria-api-repository";
import { SyncStock } from "../../Services/sync-stock/sync-stock";
import { SendProduct } from "../../Services/send-product/send-product";
import { DateService } from "../../Services/dateService/date-service";
import { ProdutoRepository } from "../../dataAcess/produto-repository/produto-repository";

export class ProdutoController {


        private delay(ms: number) {
        console.log(`Aguardando ${ms / 1000} segundos...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }



        async postProduto( req:Request , res:Response ){
            if( req.body &&    req.body.produtos.length > 0  ){
          let produtoRepository = new ProdutoRepository();
          let produtoApiRepository = new ProdutoApiRepository();
          let syncStock = new SyncStock();
          let produtoMapper = new ProdutoMapper();
          let categoriaRepository = new CategoriaApiRepository();
          let sendProduct = new SendProduct();
          let dateService = new DateService();

                let response=[]
                for( let i of req.body.produtos ){

                  let prod = await   produtoRepository.buscaProduto( Number(i))

                    let validProd = await  produtoApiRepository.findByCodeSystem(Number(i));
                    let mapper = await   produtoMapper.postProdutoMapper( prod[0] );
                    
                    if(mapper && mapper.erro ){
                      return res.status(200).json(  mapper.msg )
                      }else{
                        if( mapper.post ){

                        if(validProd.length > 0 ){
                            // verificar se ouve atualizacao 
                              /// faz a comparação da data de recadastro do sistema com a data do ultimo envio feito pela integração
                            if( new Date(prod[0].DATA_RECAD) > new Date(validProd[0].data_recad_sistema) ){

                                    // atualizar produto 
                                    let resultPutItem =   await   sendProduct.put(mapper.post, Number(validProd[0].Id) );
                                 response.push(resultPutItem?.msg);
                            if( resultPutItem?.status === 200  || resultPutItem?.status === 201 ){
                                await  produtoApiRepository.updateByParama( 
                                              {
                                              codigo_sistema: prod[0].CODIGO,
                                              com_variacao:'N',
                                              data_envio: dateService.obterDataHoraAtual(),
                                              data_estoque: mapper.dataEstoque,
                                              data_preco: mapper.dataPreco,
                                              data_recad_sistema: dateService.formatarDataHora(prod[0].DATA_RECAD),
                                              descricao:prod[0].DESCRICAO,
                                              Id: resultPutItem.id,
                                              saldo: mapper.post.saldo_estoque,
                                              variacao:'N'
                                            })
                                }
                                          
                                }else{
                                    // continua
                                    response.push(`O produto: ${prod[0].CODIGO } se encontra atualizado`)
                                }
                               
                        }else{
                          
                          let resultPostItem =   await sendProduct.post(mapper.post);
                          response.push(resultPostItem?.msg);
                          console.log(response)
                            if( resultPostItem?.status === 200  || resultPostItem?.status === 201 ){
                                await produtoApiRepository.inserir( 
                                    {
                                     codigo_sistema: prod[0].CODIGO,
                                     com_variacao:'N',
                                     data_envio: dateService.obterDataHoraAtual(),
                                     data_estoque: dateService.formatarDataHora(mapper.dataEstoque),
                                     data_preco: dateService.formatarDataHora(mapper.dataPreco),
                                     data_recad_sistema: dateService.formatarDataHora(prod[0].DATA_RECAD),
                                     descricao:prod[0].DESCRICAO,
                                     Id: resultPostItem.id,
                                     saldo: mapper.post.saldo_estoque,
                                     variacao:'N'
                                     })
                             }
                        }

                        }

                      }

                    }
                        return res.status(200).json(response) 
            }

        }

 
}
