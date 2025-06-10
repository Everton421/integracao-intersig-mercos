import { ProdutoApiRepository } from "../../dataAcess/api-produto-repository/produto-api-repository";
import ConfigApi from "../api/api";
import { DateService } from "../dateService/date-service";

export class SyncPrice{

          private    api = new ConfigApi();
          private    dateService = new DateService();
           private   produtoApi = new ProdutoApiRepository();

     private delay(ms: number) {
        console.log(`Aguardando ${ms / 1000} segundos para enviar o preço...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }



        /**
         * 
         * @param idProdutobling  id do produto no bling  
         * @param preco preco a ser atualizado
         */
        async postPrice(idProdutobling:string, preco:number ){


                    let objPatch = {
                        "preco": preco
                    }

                     try{
                     const resultPrecoEnviado = await this.api.config.patch(`/produtos/${idProdutobling}`, objPatch);

                     if ( resultPrecoEnviado.status === 200 || resultPrecoEnviado.status === 201 ){
                             await this.delay(1000);
                             await this.produtoApi.updateByParama( {  id_bling:idProdutobling ,  data_preco: this.dateService.obterDataHoraAtual()  });

                             return { ok:true, errp:false, msg:"preco atualizado com sucesso!" }

                            }     
                               }catch( e:any ){
                            console.log( "Erro ao tentar atualizar preço do produto no bling ")
                            console.log(e.response)
                        }   

        }



        
}