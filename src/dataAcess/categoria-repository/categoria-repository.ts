import { conn, db_api, db_publico } from "../../database/databaseConfig";

export class CategoriaRepository{

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
    async buscaGrupoIndex():Promise< [ { Id_bling:number, codigo_sistema:number, nome:string } ] >{
        return new Promise( async (resolve,reject)=>{
            const sql = 
    `  SELECT 
            itc.Id_bling,
            pg.CODIGO codigo_sistema,
            pg.NOME nome
       from ${db_publico}.cad_pgru pg 
        left join ${db_api}.categorias  itc 
         on itc.codigo_sistema = pg.CODIGO 
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



}