import { conn_api, database_api } from "../../database/databaseConfig";

export class ApiTabelasPrecoRepository{
 async buscaTabelas() :Promise<[{ Id:number, codigo_sistema:number, descricao:string, data_envio:string }]> {
          const sql =  ` 
              SELECT 
                     *
                      from ${database_api}.tabelas_preco tp   ; ` 
    return new Promise( async ( resolve, reject )=>{
      await conn_api.query(sql, ( err, result )=>{
          if(err){
            reject(err);
          }else{
            resolve(result);
          }
      })
    })
      }

}