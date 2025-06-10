import { PedidoApiRepository } from "../../dataAcess/api-pedido-repository/pedido-api-repository";
import { PedidoRepository } from "../../dataAcess/pedido-repository/pedido-repository";
import ConfigApi from "../api/api";

export class SyncORders{

           private  pedidoApiRepository = new PedidoApiRepository();
           private  pedidoRepository = new PedidoRepository();
           private   api = new ConfigApi();

      private delay(ms: number) {
        console.log(`Aguardando ${ms / 1000} segundos para atualizar...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     *  atualiza situação do peido no bling 
     * @returns 
     */
   async updateBling(){ 
            console.log('Atualizando pedidos no bling...  ')
       const arrOrders = await this.pedidoApiRepository.findAll(); 
         
                for ( const order of arrOrders ) { 
                          const validOrder = await  this.pedidoRepository.findByCode(order.codigo_sistema);

                          if( validOrder.length > 0 ){
                                const orderErp = validOrder[0];
                                
                                if( orderErp.SITUACAO != order.situacao){
                                console.log(`Atualizando pedido ${order.codigo_sistema} ... `)
                                        let novaSituacao = 6 ;   
                                        if( orderErp.SITUACAO === 'EA'){
                                            novaSituacao =   6 
                                        }
                                        if( orderErp.SITUACAO === 'FI'){
                                            novaSituacao =  9 ;
                                        }
                                    try{
                                        await this.delay(1000);
                                        let resultPatchOrder = await  this.api.config.patch(`/pedidos/vendas/${order.Id_bling}/situacoes/${novaSituacao}`);
                                        if(resultPatchOrder.status === 200 ||resultPatchOrder.status ===204 ){
                                            this.pedidoApiRepository.updateBYParam( { Id_bling: order.Id_bling, codigo_sistema: order.codigo_sistema, situacao: orderErp.SITUACAO  })
                                        }
                                    }catch( err:any ){
                                        console.log(`Erro ao tentar atualizar pedido no bling `, err.response.data.error);
                                        return err.response.data.message
                                        }   
                                    // enviar atualização do pedido
                                }else{
                                    console.log(`Pedido: ${ order.codigo_sistema} sem alteração`)
                                }
                            }else{
                             console.log(` pedido: ${order.codigo_sistema}, id: ${order.Id_bling}  não foi encontrado`)
                       }
             } 
             
        }
}