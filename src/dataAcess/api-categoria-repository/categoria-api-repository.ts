import { conn_api, database_api } from "../../database/databaseConfig";
import { DateService } from "../../Services/dateService/date-service";

export class CategoriaApiRepository{
    private dateService = new DateService();

    formatDescricao(descricao: string): string {
        return descricao.replace(/'/g, '');
        }
    
    
        async buscaCategoriasApi( ):Promise<[ { Id_bling:number, descricao:string, codigo_sistema:number, data_envio:string}]>{
        return new Promise( async (resolve,reject)=>{
            const sql = 
            `SELECT * FROM ${database_api}.categorias ;
             `
                await conn_api.query(sql,   (err,result)=>{
                    if(err){
                        console.log('erro ao buscar categorias enviadas ', err)
                        reject(err);
                    }else{
                        resolve(result)
                    }
                })
        })
    }
    
        async buscaCategoriaApi( codigo:number):Promise<[ { Id_bling:number, descricao:string, codigo_sistema:number, data_envio:string}]>{
        return new Promise( async (resolve,reject)=>{
            const sql = 
            `SELECT * FROM ${database_api}.categorias WHERE codigo_sistema = ? ;
             `
                await conn_api.query(sql,[codigo], (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result)
                    }
                })
        })
    }

    
    async cadastraCategoriaApi( value:any ){
        return new Promise( async (resolve,reject)=>{

            let dataInsercao = this.dateService.obterDataHoraAtual()
            
            const { id_bling, codigo_sistema , descricao} = value;

            let descricaoSemAspas = this.formatDescricao(descricao);

             const sql = ` INSERT INTO ${database_api}.categorias VALUES ('${id_bling}','${descricaoSemAspas}','${codigo_sistema}', '${dataInsercao}')` 
            
                await conn_api.query(sql, (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result)
                    }
                })
        })
    }



}