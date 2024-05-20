import ConfigApi from "../../Services/api";
import { ClienteErp } from "../../models/cliente/clienteErp";
import { clienteApi } from "../../models/clienteApi/clienteApi";

export class pedidoController{



async buscaPedidosBling(){
    const api = new ConfigApi();

    const  clientERP = new ClienteErp();

    const clientApi = new clienteApi();

    await  api.configurarApi();

        let dadosPedidos;

        try{
        dadosPedidos = await api.config.get('/pedidos/vendas');
        }catch(err) { throw err }


        const arr = dadosPedidos.data.data
 
       for( const data of arr ){

            let clientPedidoBling = data.contato.id;
              let cpfClientBling = data.contato.numeroDocumento;
               let clientvalidacao:any =[];
           
               
           try{
            clientvalidacao = await  clientERP.buscaPorCnpj(cpfClientBling);
         //   console.log(clientvalidacao);
           }catch(err) { console.log("erro ao validar  cliente") }


           let dadosClientBling:any;
           let dadosClientErp:any;

             if(clientvalidacao.length > 0 ){
             //    console.log( 'cliente encontrado no sistema');
                 dadosClientErp = clientvalidacao[0].CODIGO;
             }else{

                 try{
                     dadosClientBling = await api.config.get(`/contatos/${clientPedidoBling}`);
                        
                     try{
                         const resposta = dadosClientBling.data.data
                             console.log('cadastrando cnpj: ', cpfClientBling )
                                try{
                                 const clientCadastradoErp:any = await clientERP.cadastrarClientErp(resposta);
                                 
                                 dadosClientErp = clientCadastradoErp.insertId;
                                  
                                 if(dadosClientErp > 0 ){
                                    const dadosCadastroClientApi = { clientPedidoBling , dadosClientErp, cpfClientBling }
                                    try{
                                    const respostaClienteApi = await clientApi.cadastrarClientApi(dadosCadastroClientApi); 
                                        //console.log(respostaClienteApi)
                                }catch(err){ console.log("erro ao inserir clienteApi "+err); }
                                }

                                }catch(err){
                                    console.log('erro ao cadastrar o cliente')
                                }

                         }catch(err){console.log(err)}
                 
                 }catch(err){console.log(err);}
            
             }
             //console.log(dadosClientErp);

             



       }


}



}