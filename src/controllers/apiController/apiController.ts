import { conn, database_api } from "../../database/databaseConfig"
var cron = require('node-cron');

export class apiController{



    async buscaConfig( ){
        return new Promise( async (resolve, reject)=>{
            const sql =
            ` SELECT * FROM ${database_api}.config_bling;`
            await conn.query( sql, ( err, result )=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                
                }
            })
        })
    }

    
  async  main(){

let aux:any ;
    try{
         aux= await this.buscaConfig();
    }catch(err){ console.log(err);}

    
        let config;

        if(aux.length > 0 ){
            config = aux[0];
        }else{
            return;
        }


        if(config.importar_pedidos  === 1){
            cron.schedule('* * * * * *', () => {
                console.log("importando pedidos");
            });
        }else{
            return;
        }



        if(config.enviar_estoque === 1){
        
            cron.schedule('* * * * * *', () => {
                console.log('enviando estoque')
            });
        
        }else{
            return;
        }

        if(config.enviar_precos === 1){
            console.log('enviando preco')
        }else{
            return;
        }






    }



}