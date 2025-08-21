import { api } from "../api/api";
import { delay } from "../delay-service/delay-service";


export class GetClientService{
private   delay(ms: number) {
        return new Promise(resolve => {
             console.log( `Aguardando ${ms / 1000} segundos para obter os dados do cliente ...` ); 
            setTimeout(resolve, ms) 
        });
    }

    async getClient(id:any){
        let client = null;
        while( true ){
            try{
                let resultClientMercos = await api.get(`/v1/clientes/${id}`);
                    if( resultClientMercos.status === 200 || resultClientMercos.status === 201 ){
                        // retornar cliente   
                                client = resultClientMercos.data
                    }
                }catch(e:any){  
                         if( e.response.status == 429 ){
                                       let tempoPermissao = e.response.data.tempo_ate_permitir_novamente  * 1000;
                                       
                                    await this.delay(tempoPermissao);
                         }  else{
                            console.log(`Ocorreu um erro ao tentar consultar o cliente id: ${id} no mercos`, e.response)
                            break;
                        } 
                }
                if(client !== null && client.id > 0 ){
                    break;
                }
        }
        return client;
    }


}