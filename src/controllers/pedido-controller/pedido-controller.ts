import ConfigApi from "../../Services/api/api";
import {  PedidoRepository } from "../../dataAcess/pedido-repository/pedido-repository";
import { PedidoApiRepository } from "../../dataAcess/api-pedido-repository/pedido-api-repository";
import { SyncClient } from "../../Services/sync-client/sync-client";

export class pedidoController{

    private api = new ConfigApi();
    private pedidoApi = new PedidoApiRepository();
    private objPedidoErp = new PedidoRepository();
    private syncClient = new SyncClient();


     delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



async buscaPedidosBling( vendedor:number ){
    
    await  this.api.configurarApi();

        let pagina = 1;
        let limite = 100;

        while( true ){
            await this.delay(2000)   
            let dadosPedidos;
            try{
                dadosPedidos = await this.api.config.get('/pedidos/vendas', {
                    params:{
                        pagina: pagina,
                        limite:limite
                    }
                });
            }catch(err) { 
                    //throw err
                        console.log(` Erro ao buscar a pagina: ${pagina} de pedidos do bling`, err)
                    break;
            }

            const arr = dadosPedidos.data.data

                if(!arr || arr.length === 0 )   {
                    console.log(" Não há mais pedidos a serem importados!")
                    break;
                }

        for( const data of arr ){
                try{
                    let clientPedidoBling = data.contato.id;
                    let cpfClientBling = data.contato.numeroDocumento;
                    let idPedidoBling = data.id; 
                
            //       inicio validação do cliente 
                let codigoClientErp  = await this.syncClient.getClient(clientPedidoBling,cpfClientBling ); 
            //fim da validação do cliente 
                
                        // busca pedido completo
            await this.delay(1000)   
                  console.log(` Processando pedido ${idPedidoBling}...  `)
                    const response  = await this.api.config.get(`/pedidos/vendas/${idPedidoBling}`);
                    const pedidoResponse = response.data.data;
                
                        const responseValidacao:any  = await this.pedidoApi.validaPedido(pedidoResponse.id);
                            if ( responseValidacao.length > 0 ){
                                const codigPedidoCadastrado = responseValidacao[0].codigo_sistema;
                                console.log(`Pedido já cadastrado. ID Bling: ${idPedidoBling}, ID Interno: ${codigPedidoCadastrado}`);
                                continue; 
                             }else{
                                console.log(`resgistrando pedido ${idPedidoBling}...` )
                                await this.objPedidoErp.cadastrarPedido( pedidoResponse, codigoClientErp, vendedor)
                                console.log(`Pedido ID Bling: ${idPedidoBling} cadastrado com sucesso!`);
                             }
                    }catch(err){
                        console.error(`Ocorreu um erro ao processar o pedido ID: ${data.id}. Pulando para o próximo.`, err);
                    continue;
                }
            }
        pagina++;
    }
 }
}
