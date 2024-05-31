import { promises } from "form-data";
import { conn, db_publico } from "../../database/databaseConfig";

export class categoriaErp{

    async buscaGrupos(){
        return new Promise( async (resolve,reject)=>{

            const sql = 
            `SELECT * FROM ${db_publico}.cad_pgru;
             `
                await conn.query(sql, (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result)
                    }
                })
        })
    }


    async buscaGrupo( grupo:number ){
        return new Promise( async (resolve,reject)=>{
            const sql = 
            `SELECT * FROM ${db_publico}.cad_pgru WHERE CODIGO = ?;
             `
                await conn.query(sql, [grupo],(err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result)
                    }
                })
        })
    }

}