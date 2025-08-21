import { PedidoMercos } from "../../interfaces/IPedido-mercos";
import { api } from "../api/api";


export class GetOrdersService{
 
 
 
    private   delay(ms: number) {
        return new Promise(resolve => {
             console.log( `Aguardando ${ms / 1000} segundos...` ); 
            setTimeout(resolve, ms) 
        });
    }

    /**
     * retorna os pedidos do mercos
     * @param data data usada para a consulta, serão retornado registros alterados após esta data
     * @returns 
     */
    async getORders ( data:string ):Promise< PedidoMercos[] | []  >{

          let dataReq = data;
        let pagina = 0;

           let dadosPedidos:PedidoMercos[] = [] ;

           let resultData
                  try{
                        console.log("Iniciando busca ...")
                             resultData = await api.get(`/v2/pedidos?alterado_apos=${dataReq}`  );
                            //console.log(resultData.headers);
                        dadosPedidos = resultData.data;

                        }catch(err:any) { 
                                        if(err.response.status === 429 ) {
                                            let tempoPermissao = err.response.data.tempo_ate_permitir_novamente  * 100;
                                            await this.delay( tempoPermissao)
                                        }else{
                                        console.log(` Erro ao buscar os pedidos do mercos`, err.response.data);
                                        }
                                }

                            let arr;
                                if( resultData  && resultData.headers.meuspedidos_requisicoes_extras > 0  ){
                                    arr =  resultData.data 
                                let ultimoProd = arr[arr.length - 1 ];
                                dataReq = ultimoProd.ultima_alteracao;
                                pagina = resultData.headers.meuspedidos_requisicoes_extras;
                            }

                            if(pagina >=  1){
                                console.log(` Obtendo mais dados quantidade de pagina : ${pagina}  `)
                            }
                    while(  pagina >=  1 ){ 
                        await this.delay(2000)   
                            console.log(`Obtendo dados pagina: ${pagina}`)
                           try{
                             resultData = await api.get(`/v2/pedidos?alterado_apos=${dataReq}`  );
                                if( resultData.status === 200 ||  resultData.status === 201 ){
                                        arr =  resultData.data 
                                        let ultimoProd = arr[arr.length - 1 ];
                                        dataReq = ultimoProd.ultima_alteracao;
                                        dadosPedidos = dadosPedidos.concat(arr)
                                         pagina--;
                                    }
                            }catch(err:any) { 
                                if(err.response.status === 429 ) {
                                            let tempoPermissao = err.response.data.tempo_ate_permitir_novamente  * 1000;
                                            await this.delay( tempoPermissao)
                                        }else{
                                        console.log(` Erro ao buscar os pedidos do mercos`, err.response.data);
                                        }
                            }
                    }
                    
                    return dadosPedidos;
    }
}