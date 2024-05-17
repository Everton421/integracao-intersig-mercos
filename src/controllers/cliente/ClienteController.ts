import ConfigApi from "../../Services/api"

export class ClienteController{


    async recebimentoDeCliente(){
        const api = new ConfigApi()
        // aguarda a configuração da api 
        await api.configurarApi();


        return new Promise( async (resolve , reject )=>{
            try{
                    
                const response = await api.config.get('/contatos');
                    console.log(response.data);
                    resolve(response) 


            }catch(err){   
                console.log(err);
            }

        })

    }


}