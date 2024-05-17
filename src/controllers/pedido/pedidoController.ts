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
            clientvalidacao = await  clientERP.validaCadastro(cpfClientBling);
           }catch(err) { console.log("erro ao validar  cliente") }

         

             if(clientvalidacao === true){
                 console.log( 'cliente encontrado no sistema');
                
             }else{
                 let dadosClientBling:any;
                 try{
                     dadosClientBling = await api.config.get(`/contatos/${clientPedidoBling}`);
                     try{
                         const resposta = dadosClientBling.data.data
                             console.log('cadastrando cnpj: ', cpfClientBling )
                                try{
                                 const respostaCadastro:any = await clientERP.cadastrarClientErp(resposta);
                                  console.log(respostaCadastro)
                                }catch(err){
                                    console.log('erro ao cadastrar o cliente')
                                }

                         }catch(err){console.log(err)}
                 
                 }catch(err){console.log(err);}
            
             }

       }

}



}