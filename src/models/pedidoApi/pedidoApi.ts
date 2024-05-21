import { conn_api } from "../../database/databaseConfig"

export class PedidoApi{


    async validaPedido( id:string ){

            const sql = ` ` 
        return new Promise(  async (resolve,reject)=>{
            await conn_api.query(sql, ( err ,result)=>{

            })
        })
    }
}