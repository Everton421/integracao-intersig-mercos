import { ProdutoApiRepository } from "../../dataAcess/api-produto-repository/produto-api-repository";
import { ProdutoRepository } from "../../dataAcess/produto-repository/produto-repository";
import { api } from "../api/api";
import { DateService } from "../dateService/date-service";


export class SendTablePrice{
  private   delay(ms: number) {
        return new Promise(resolve => {
             console.log( `Aguardando ${ms / 1000} segundos...` ); 
            setTimeout(resolve, ms) 
        });
    }

    private dateService = new DateService() 

    private produtoRepository = new ProdutoRepository();

    private produtoApiRepository = new ProdutoApiRepository();

    async postTables(){

        let arrTables:[{ CODIGO:number, DESCRICAO:string }] | [] = []    
        try {
         arrTables = await this.produtoRepository.buscaTabelas();
        } catch (error) {
            console.log("Erro ao obter os dados das tabelas de preco!") 
        }

         if ( arrTables.length > 0 ){
                for ( const item of arrTables  ){
                    let arrValidSynced = await this.produtoApiRepository.buscaTabelasPorCodigo(item.CODIGO);
                        if( arrValidSynced.length){
                            console.log(` A tabela de preco ${ item.DESCRICAO} já foi enviada!  `)
                        }else{
                        
                            console.log(` Enviando ${ item.DESCRICAO} ...  `)

                                let resultApi;  
                                this.delay(2000 );
                                //while(){
                                //}

                                try {
                                        resultApi = await api.post(`/v1/tabelas_preco`, {
                                            nome:item.DESCRICAO,
                                            tipo:"D",
                                            desconto: 0.00
                                        })
                                        if( resultApi.status === 200 || resultApi.status === 201 ){
                                              let id = resultApi.headers.meuspedidosid 
                                            await this.produtoApiRepository.insertTabela({ codigo_sistema: item.CODIGO,id:id, descricao:item.DESCRICAO, data_envio: this.dateService.obterDataHoraAtual() })
                                        }   

                                    } catch (error:any ){
                                            console.log(`Erro ao tentar enviar a tabela de preco para o mercos `, error.response.data);
                                    }
                             
                             }
                        }

                }   

        }
    


}