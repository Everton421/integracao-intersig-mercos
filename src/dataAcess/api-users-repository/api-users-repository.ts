import { conn, db_api } from "../../database/databaseConfig";

export type IUserApi = {

    id:number 
     codigo:number
    nome:string  
    senha:string  
    email:string 

}

export class ApiUsersRepository{

  
    async findSyncedByCodeSystem(codigo:number):Promise<IUserApi[]>{
        return new Promise( async ( resolve , reject )=>{

                const sql = 
                `SELECT * FROM ${db_api}.usuarios where codigo = ?
                ` 
                await conn.query( sql, codigo, ( err, result)=>{
                    if(err){
                        console.log("Erro ao tentar obter os dados do usuario codigo: ",codigo)
                        console.log(err);
                    }else{  
                        resolve(result);
                    }
                })
          })
    }
      
    async findSyncedById(id:number):Promise<IUserApi[]>{
        return new Promise( async ( resolve , reject )=>{

                const sql = 
                `SELECT * FROM ${db_api}.usuarios where Id = ?
                ` 
                await conn.query( sql, id, ( err, result)=>{
                    if(err){
                        console.log("Erro ao tentar obter os dados do usuario Id: ",id)
                        console.log(err);
                    }else{  
                        resolve(result);
                    }
                })
          })

        }

        async findSyncedByEmail(email:string):Promise<IUserApi[]>{
        return new Promise( async ( resolve , reject )=>{

                const sql = 
                `SELECT * FROM ${db_api}.usuarios where email = ?
                ` 
                await conn.query( sql, email, ( err, result)=>{
                    if(err){
                        console.log("Erro ao tentar obter os dados do usuario email: ",email)
                        console.log(err);
                    }else{  
                        resolve(result);
                    }
                })
          })
    }



}