import { ApiUsersRepository } from "../../dataAcess/api-users-repository/api-users-repository";
import { api } from "../api/api";

export class SyncUsers{
     
    private apiUsersRepository = new ApiUsersRepository();

    async getUsers(data:string){
 let usersMercos 
            try{
          usersMercos = await api.get(`/v1/usuarios?alterado_apos = ${data}`);

       }catch(e){
            console.log("Ocorreu um erro ao tentar obter os usuarios do mercos ", e);
       }

         
        if(usersMercos && usersMercos?.data.length > 0  ){

                for( let i of usersMercos.data){

                    
                }
             
    }

    }
}