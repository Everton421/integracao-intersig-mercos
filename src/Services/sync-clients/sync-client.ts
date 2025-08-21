import { ClienteApiRepository } from "../../dataAcess/api-cliente-repository/cliente-api-repositoryi";
import { ClienteRepository } from "../../dataAcess/cliente-repository/cliente-repositori";
import { api } from "../api/api";

export class SyncClient{

    private clienteApiRepository =  new ClienteApiRepository();
    private clientRepository = new ClienteRepository();


    async validateClient( id:any ){
            let validClient = await this.clienteApiRepository.getByID(id);

        if( validClient.length > 0 ){
            console.log("cliente encontrado!")
        }else{
            console.log('cadastrando cliente')

                try{
                      const resultData = await api.get(`/v1/clientes/${id}`  );
                           if( resultData.status === 200 || resultData.status === 201 ){

                                    
                           } 
                }catch(e){

                }

        }


    }
}