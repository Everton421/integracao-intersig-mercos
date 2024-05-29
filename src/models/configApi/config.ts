import { conn, conn_api, database_api } from "../../database/databaseConfig";

export class configApi{

    async atualizaDados( json:any ){

        let { 
             importar_pedidos,
              enviar_estoque,
               enviar_precos 
            } = json; 
            

            if(!importar_pedidos){
                importar_pedidos = 0;
            }else{
                importar_pedidos = parseInt(importar_pedidos);
            }

            if(!enviar_estoque){
                enviar_estoque =0;
            }else{
                enviar_estoque = parseInt(enviar_estoque)
            }
            if(!enviar_precos){
                enviar_precos = 0
            }else{
                enviar_precos = parseInt(enviar_precos);
            }


        return new Promise ( async (resolve,reject ) =>{
            const sql = `
                UPDATE ${database_api}.config_bling set  importar_pedidos = ${importar_pedidos} , 
                enviar_estoque =  ${enviar_estoque}  , enviar_precos = ${enviar_precos}    where id = 1;
            `
            await conn.query(sql, (err,result )=>{
                if(err){
                    reject(err);
                }else{
                    console.log('dados atualizados ')
                    resolve(result);
                }
            })
          //  console.log(sql)

           
        })
    }
}