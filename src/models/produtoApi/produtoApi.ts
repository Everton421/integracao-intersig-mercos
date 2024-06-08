import { conn_api, database_api, db_estoque } from "../../database/databaseConfig"

export class ProdutoApi{

    formatDescricao(descricao: string): string {
    return descricao.replace(/'/g, '');
    }

        async inserir( value:any ){
            const now = new Date(); // Obtém a data e hora atuais

            const dia = String(now.getDate()).padStart(2, '0');
            const mes = String(now.getMonth() + 1).padStart(2, '0');
            const ano = now.getFullYear();
      
            const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
            const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
            const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
      
            const dataInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

            return new Promise( async (resolve, reject)=>{
                


                const { id_bling, codigo_sistema , descricao} = value;


                let descricaoSemAspas = this.formatDescricao(descricao);
                

                const sql = ` INSERT INTO ${database_api}.produtos VALUES ('${id_bling}','${descricaoSemAspas}','${codigo_sistema}', '${dataInsercao}')` 

                await conn_api.query(sql, (err, result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }

        async buscaTodos(){
            return new Promise( async ( resolve, reject )=>{
                const sql = ` SELECT p.codigo_sistema , p.descricao, p.Id_bling, ps.SKU sku, ps.ESTOQUE estoque  
                 FROM ${database_api}.produtos  p
                 JOIN ${db_estoque}.prod_saldo ps on ps.CODIGO = p.codigo_sistema 
                 ORDER BY p.Id_bling  ASC

                ;`
                await conn_api.query(sql, (err, result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }

        async busca( produto:any ){
            return new Promise( async ( resolve, reject )=>{
                const sql = ` SELECT * FROM ${database_api}.produtos WHERE  codigo_sistema = ${produto} ;`
                await conn_api.query(sql, (err, result )=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        } 



}
