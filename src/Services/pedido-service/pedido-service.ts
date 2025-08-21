import { PedidoApiRepository } from "../../dataAcess/api-pedido-repository/pedido-api-repository";
import { FormaPagamentoRepository } from "../../dataAcess/forma-pagamento-repository/forma-pagamento-repository";
import { PedidoRepository } from "../../dataAcess/pedido-repository/pedido-repository";
import { cad_orca } from "../../interfaces/cad_orca";
import { IPro_orca } from "../../interfaces/IPro_orca";
import { PedidoMapper } from "../../mappers/pedido-mapper";

export class PedidoService{
    
       private  pedidoRepository = new PedidoRepository() 
       private pedidoMapper = new PedidoMapper()
       private pedidoApiRepository = new PedidoApiRepository();


    /**
     *  recebe os dados do pedido, formato e insere no banco de dados do sistema
     * @param codigoCliente 
     * @param pedido pedido vindo da api 
     * @returns 
     */
    async insert(codigoCliente:number , pedido:any    ){
        let vendedor =  1 
        let codigoPedidoSistema = 0; 
            let cadorca =    this.pedidoMapper.cadOrcaMapper( pedido, codigoCliente, vendedor, 1  )
                 let arrItens =[]
                let insertOrder
                    try{
                             insertOrder =  await this.pedidoRepository.cadastrarPedido(cadorca );
                    }catch(e){
                        console.log("Erro ao tentar registrar os dados do pedido ", e )
                    }
           
            if ( insertOrder &&  insertOrder.insertId > 0 ){
                codigoPedidoSistema = insertOrder.insertId
                 let count = 1;
                 for( const i of pedido.itens ){
                       let pro_orcaMapper = await this.pedidoMapper.proOrcaMapper( 1, i,  codigoPedidoSistema, count  )
                            //
                       
                            if( pro_orcaMapper && pro_orcaMapper.PRODUTO ) arrItens.push(pro_orcaMapper); 
                       count++;
                   }
             } else{
                console.log("Ocorreu um erro ao tentar inserir o pedido")
                return
             }
           /// cadastro os produtos 
                    try{
                        if( arrItens.length > 0 ){

                            await this.pedidoRepository.cadastraProdutosDoPedido( arrItens, codigoPedidoSistema);                      
                        }

                        }catch(e){
                        console.log("Erro ao tentar registrar os produtos  do pedido ", e )
                        return
                    
                    }

                let arrParcelas    = await this.pedidoMapper.parOrcaMapper(pedido.forma_pagamento_id ,codigoPedidoSistema, pedido.total)

                    try{
                          await this.pedidoRepository.cadastraParcelasDoPedido(arrParcelas, codigoPedidoSistema)
                   }catch(e){
                        console.log("Erro ao tentar registrar as parcelas do pedido ", e )
                        return
                    }   

                    let status = 'EA';
                        if( pedido.status === 2 ){
                            status = 'EA'
                        } 
                        if( pedido.status === 0 ) {
                            status = 'RE'
                        }

                        await this.pedidoApiRepository.cadastraPedidoApi( { Id:pedido.id, codigo_sistema:codigoPedidoSistema, situacao:status })
           // console.log(" cad_orca mapper: ",cadorca)
           //console.log("produtos mapper: ", arrItens)
           //console.log("parcelas mapper: ", arrParcelas);

    }


    /**
     * 
     * @param pedido 
     * @param itens 
     * @param parcelas 
     * @param codigoPedido 
     */

    async update( pedido:any,   codigoCliente:number,  codigoPedido:number    )  {
            return new Promise( async ( resolve, reject ) =>{

                let arrParcelas    = await this.pedidoMapper.parOrcaMapper(pedido.forma_pagamento_id ,codigoPedido, pedido.total)

                const cad_orca  = await this.pedidoMapper.cadOrcaMapper(pedido, codigoCliente, 1, arrParcelas.length);
                    let pro_orca=[]    ;
                    let count = 1;
                
                    for( const i of  pedido.itens ){
                        const map  = await this.pedidoMapper.proOrcaMapper( 1, i,  codigoPedido, count  )
                        pro_orca.push(map)  
                        count++;
                        }

                    let validUpdatedOrder = true;
                try{    
                        let resulUpdateOrder = await this.pedidoRepository.updatePedido(cad_orca, codigoPedido);
                        if ( !resulUpdateOrder || resulUpdateOrder.affectedRows  === 0 ){
                                validUpdatedOrder = false
                                    return;
                        }   
                    }catch( e ){
                    console.log(e);
                }
                if( validUpdatedOrder ){
                    
                        try{
                            let resultDelete = await this.pedidoRepository.deleteParcelas(codigoPedido);
                        }catch(e){
                            console.log(e);
                            }
                        try{
                            for( let p of arrParcelas ) {
                                let aux =  await this.pedidoRepository.cadastraParcelaDoPedido( p, codigoPedido)
                                }
                        }catch(e){
                             console.log(e);
                        }
                       try{
                        let resultDelete=   await this.pedidoRepository.deleteProdutos(codigoPedido);
                       }catch(e){
                            console.log(e);
                       }
                     try{
                           await this.pedidoRepository.cadastraProdutosDoPedido(pro_orca, codigoPedido);
                       }catch(e){
                            console.log(e);
                       }

                        let status = 'EA';
                        if( pedido.status === 2 ){
                            status = 'EA'
                        } 
                        if( pedido.status === 0 ) {
                            status = 'RE'
                        }
                        await this.pedidoApiRepository.updateBYParam( { codigo_sistema:codigoPedido, data_insercao:pedido.ultima_alteracao, Id:pedido.id, situacao:status })

                       console.log("pedido atualizado com sucesso")
                }
            })

    }
}