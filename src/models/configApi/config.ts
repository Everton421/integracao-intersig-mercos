import { conn_api, database_api } from "../../database/databaseConfig";

export class configApi{

    async atualizaDados( json:any ){

        let { 
             importar_pedidos,
              enviar_estoque,
               enviar_preco 
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
            if(!enviar_preco){
                enviar_preco = 0
            }else{
                enviar_preco = parseInt(enviar_preco);
            }


        return new Promise ( async (resolve,reject ) =>{
            const sql = `
                UPDATE ${database_api}.config_bling set  importar_pedidos = ${importar_pedidos} , 
                enviar_estoque =  ${enviar_estoque}  , enviar_precos = ${enviar_preco}    where id = 1;
            `
            console.log(sql)
           
        })
    }
}