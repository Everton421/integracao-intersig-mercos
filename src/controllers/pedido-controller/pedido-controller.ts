 
import { GetOrdersService } from "../../Services/get-orders-service/get-orders-service";
import { ClienteApiRepository } from "../../dataAcess/api-cliente-repository/cliente-api-repositoryi";
import { GetClientService } from "../../Services/get-client-service/get-client-service";
import { ClienteRepository } from "../../dataAcess/cliente-repository/cliente-repositori";
import { ClienteMapper } from "../../mappers/cliente-mapper";
import {  PedidoService } from "../../Services/pedido-service/pedido-service";
import { PedidoApiRepository } from "../../dataAcess/api-pedido-repository/pedido-api-repository";
import { loggerPedidos, loggerProdutos } from "../../utils/logger-config";  

export class pedidoController{

    private getOrdersService = new GetOrdersService();
    private clienteApiRepository = new ClienteApiRepository();
    private getClientService = new GetClientService();
    private clienteRepository = new ClienteRepository();
    private clienteMapper = new ClienteMapper();
    private pedidoService = new PedidoService();
    private pedidoApiRepository = new PedidoApiRepository();

  private   delay(ms: number) {
        return new Promise(resolve => {
             console.log( `Aguardando ${ms / 1000} segundos...` ); 
            setTimeout(resolve, ms) 
        });
    }

/**
 * @param filial filial onde será consultado custos dos produtos
 * @param data data a ser usada para efetuar a requisição, será feita requisições para obter os dados após esta data 
 */
async buscaPedidos( filial:any, data :string  ){


       let dadosPedidos =  await this.getOrdersService.getORders(data);
                    console.log("total pedidos a serem processados: ",dadosPedidos.length)
                     
                       // console.log( dadosPedidos[0])
                         for(let i of dadosPedidos ){
                    
                            let codigoCliente = 0;
                            /// verifica se o cliente ja foi recebido
                            let arrValidApiClient = await this.clienteApiRepository.getByID(i.cliente_id);
                            let resultClientApi;

                             await this.delay(5000)
                            // obtem o cadastro do cliente no mercos 
                            resultClientApi = await this.getClientService.getClient(i.cliente_id);

                            // transforma os dados para inserir na tabela cad_clie
                           let mapperClient = this.clienteMapper.cad_clieMapper(resultClientApi);

                                 // verifica se ouve atualzação do cliente.
                                    if( arrValidApiClient.length > 0 ){
                                            let client = arrValidApiClient[0];
                                            console.log(`Verificando possivel atualização do Cliente: [ ${resultClientApi.nome_fantasia}] ` )
                                            
                                                    if( new Date(resultClientApi.ultima_alteracao) > new Date(client.data_recad_sistema) ){
                                                        console.log(`Atualizando Cliente: [ ${resultClientApi.nome_fantasia} ]...`);
                                                            console.log(   resultClientApi.ultima_alteracao  ," > ", client.data_recad_sistema  )
                                                            let resultUpdateClient =  await this.clienteRepository.updateClientErp(mapperClient,client.codigo_sistema );
                                                                
                                                            if(resultUpdateClient.affectedRows > 0 ){ console.log( "Cliente atualizado com sucesso!") }

                                                            //update cliente
                                                    } else{
                                                        console.log(`Cliente: [ ${resultClientApi.nome_fantasia} ] se encontra atualizado...`);
                                                    }
                                                    codigoCliente = client.codigo_sistema;
                                        }else{      
                                             console.log(" cadastrando cliente"   );
                                                let resultInsertClientSistem =   await this.clienteRepository.cadastrarClientErp(mapperClient)
                                                let resultInsertClientIntegration;
                                                if(resultInsertClientSistem.insertId > 0 )   {
                                                            resultInsertClientIntegration = await this.clienteApiRepository.cadastrarClientApi({
                                                                id: resultClientApi.id,
                                                                codigoCliente: resultInsertClientSistem.insertId,
                                                                cpf:resultClientApi.cnpj
                                                            })
                                                        }
                                                    codigoCliente = resultInsertClientSistem.insertId;
                                                        if(resultInsertClientIntegration &&  resultInsertClientIntegration?.insertId > 0 && resultInsertClientSistem.insertId > 0 ){
                                                            console.log( console.log(` Cliente: [ ${resultClientApi.nome_fantasia} ] registrado com sucesso !` ));
                                                        } else {
                                                            console.log(`Ocorreu um erro ao tentar inserir o cliente: [ ${resultClientApi.nome_fantasia} ] ` )
                                                            /// pula para o proximo pedido caso der erro na validação do cliente
                                                            continue;
                                                        }
                                      }
                                        
                                        console.log("processando pedido para o cliente codigo:", codigoCliente);
                                        loggerPedidos.info( "processando pedido para o cliente codigo: ", codigoCliente )
                                      let validOrder  = await this.pedidoApiRepository.findSincedOrder( String(i.id) );
                                        if( validOrder.length > 0 ){

                                            if(  new Date(i.ultima_alteracao) > new Date(validOrder[0].data_insercao)   ){
                                                    console.log(  i.ultima_alteracao  ,"  > " , validOrder[0].data_insercao  );
                                                    console.log(` atualizando  pedido: ${validOrder[0].codigo_sistema} `)
                                        loggerPedidos.info( ` atualizando  pedido: ${validOrder[0].codigo_sistema} `)

                                                   const resultUpdateOrder =  await this.pedidoService.update( i, codigoCliente, validOrder[0].codigo_sistema, ) 
                                            }else{
                                                    console.log(  i.ultima_alteracao  ,"  <  " ,  validOrder[0].data_insercao   );
                                                    console.log( `o pedido  ${validOrder[0].codigo_sistema} se encontra atualizado `);
                                                loggerPedidos.info( `o pedido  ${validOrder[0].codigo_sistema} se encontra atualizado `)
                                                
                                                }
                                          }else{
                                             await this.pedidoService.insert( codigoCliente ,i  )
                                        }
                                    
                        }
 
 }
}