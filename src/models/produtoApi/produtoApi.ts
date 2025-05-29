import { conn_api, database_api, db_estoque, db_publico, db_vendas } from "../../database/databaseConfig"
import { DateService } from "../../Services/dateService/date-service"

type IProdutoApi={
    Id_bling: string
    descricao:string
    codigo_sistema:number
    data_envio:string
    saldo_enviado:number
    variacao: 'S' | 'N'
}

type IProdutoApiSystem= {
    Id_bling: string
    descricao:string
    codigo_sistema:number
    data_envio:string
    saldo_enviado:number
    variacao: 'S' | 'N'

    CODIGO:number
    DESCRICAO:string
    /**  descricao vinda da tabela do sistema */

}

type inputProdApi = {
id_bling:string 
 codigo_sistema:number
  descricao:string
  saldo:number,
  variacao:'S'| 'N' | string
} 


type IDeposito  = {
      Id_bling:string 
    descricao:string
    situacao:number
    padrao: 'S' | 'N'
}

type InputDeposito  = {
    id_bling:string 
    descricao:string
    situacao:number
    padrao: 'S' | 'N'
}


export class ProdutoApi{

    formatDescricao(descricao: string): string {
    return descricao.replace(/'/g, '');
    }

        async inserir( value:inputProdApi ){
          
            const dateService = new DateService();
            return new Promise( async (resolve, reject)=>{

                const { id_bling, codigo_sistema , descricao, saldo, variacao} = value;
                let descricaoSemAspas = this.formatDescricao(descricao);

                const sql = ` INSERT INTO ${database_api}.produtos VALUES ('${id_bling}','${descricaoSemAspas}','${codigo_sistema}', '${dateService.obterDataHoraAtual()}', '${saldo}', '${variacao}')` 

                await conn_api.query(sql, (err, result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }



        async buscaTodos():Promise <IProdutoApiSystem[]> {
            return new Promise( async ( resolve, reject )=>{
               const sql = `  

                     SELECT 
                           itp.*,
                            P.CODIGO,P.DESCRICAO
                      from ${db_publico}.cad_prod P
                          LEFT JOIN  ${database_api}.produtos AS itp ON itp.codigo_sistema = P.CODIGO
                          WHERE P.NO_SITE = 'S' AND P.ATIVO = 'S'
                ;`
                await conn_api.query(sql, (err, result:IProdutoApiSystem[])=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }

        async buscaSincronizados(){
            return new Promise( async ( resolve, reject )=>{
               const sql = `  SELECT * FROM ${database_api}.produtos ;`

                await conn_api.query(sql, (err, result:IProdutoApi[])=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }

      async findByIdBling( id:string ):Promise <IProdutoApi[]> {
            return new Promise( async ( resolve, reject )=>{
                const sql = ` SELECT * FROM ${database_api}.produtos WHERE  Id_bling = '${id}' ;`
                await conn_api.query(sql, (err, result:IProdutoApi[] )=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        } 
       

        async findByCodeSystem( codigo:number ):Promise <IProdutoApi[]> {
            return new Promise( async ( resolve, reject )=>{
                const sql = ` SELECT * FROM ${database_api}.produtos WHERE  codigo_sistema = ${codigo} ;`
                await conn_api.query(sql, (err, result:IProdutoApi[] )=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        } 

        async atualizaSaldoEnviado( id:any, saldo:any ){
            return new Promise( async ( resolve, reject )=>{
                const sql = ` UPDATE ${database_api}.produtos set saldo_enviado = ${saldo} WHERE  Id_bling = ${id} ;`

                await conn_api.query(sql, (err, result )=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        } 

        async findDefaultDeposit() :Promise<IDeposito[]>{
               return new Promise( async ( resolve, reject )=>{
                const sql = ` SELECT * FROM ${database_api}.depositos WHERE  padrao = 'S' ;`
                await conn_api.query(sql, (err, result:IDeposito[] )=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }

         async insertDeposit( value:InputDeposito ){
          
            const dateService = new DateService();
            return new Promise( async (resolve, reject)=>{

                const { id_bling, descricao, padrao, situacao} = value;
                let descricaoSemAspas = this.formatDescricao(descricao);

                const sql = ` INSERT INTO ${database_api}.depositos VALUES ('${id_bling}','${descricao}','${situacao}', '${padrao }')` 

                await conn_api.query(sql, (err, result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }

}
