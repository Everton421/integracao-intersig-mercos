import { conn_api, database_api } from "../../database/databaseConfig"

export class PedidoApi{

    data(){
        const now = new Date(); // Obtém a data e hora atuais
        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
    
        const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
    
        const dataHoraInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
        const dataInsercao = `${ano}-${mes}-${dia}`; 
        return {dataHoraInsercao, dataInsercao};
    }

    async validaPedido( id:string ){

            const sql = `SELECT * FROM ${database_api}.pedidos where Id_bling = ${id};`

        return new Promise(  async (resolve,reject)=>{
            await conn_api.query(sql, ( err ,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    }


    async cadastraPedidoApi( json:any ){
            return new Promise(  async (resolve, reject)=>{
                const {
                    Id_bling,
                    codigo_sistema
                } = json;

                const data = this.data().dataHoraInsercao;

                const sql = 
                ` INSERT INTO ${database_api}.pedidos values ('${Id_bling}', '${codigo_sistema}', '${data}')` 
                await conn_api.query( sql,(err, result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result)
                    }
                })
            })
    }
}