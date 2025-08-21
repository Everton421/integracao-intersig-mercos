import { conn_api, database_api,    db_publico,  } from "../../database/databaseConfig"
import { IPro_orca } from "../../interfaces/IPro_orca"
import { DateService } from "../../Services/dateService/date-service"

/**
 *   representa os dados vindos da tabela de produtos da integração.
 */
type IProdutoApi={ 
    Id: string
    descricao:string
    codigo_sistema:number
    data_envio:string
    saldo_enviado:number
    variacao: 'S' | 'N'
    data_recad_sistema:string
    data_estoque:string
    com_variacao: 'S' | 'N'
    data_preco:string
    
}

type queryInsertTabelaPreco={
    id:number
    descricao:string
    codigo_sistema:number
    data_envio:string
      }

 
export type IProdutoApiSystem= { // 
    Id: string
    descricao:string
    codigo_sistema:number
    data_envio:string
    saldo_enviado:number
    variacao: 'S' | 'N'
    data_recad_sistema:string
    data_estoque:string

    CODIGO:number
    DESCRICAO:string
    /**  descricao vinda da tabela do sistema */
}

/**
 *   representa os dados necessarios para inserir um item na tabela de produtos da integração.
 */
type inputProdApi = {
  Id:string 
  codigo_sistema:number
  descricao:string
  saldo:number,
  variacao:'S'| 'N' | string
  data_recad_sistema:string
  data_estoque:string
  data_envio:string
  com_variacao:'S'| 'N' | string
   data_preco:string
} 

/**
 *   representa os dados do deposito cadastrado na tabela depositos da integração.
 */
type IDeposito  = {
     Id:string 
    descricao:string
    situacao:number
    padrao: 'S' | 'N'
}

/**
 *   representa os dados necessarios para cadastrar na tabela depositos da integração.
 */
type InputDeposito  = {
    id_bling:string 
    descricao:string
    situacao:number
    padrao: 'S' | 'N'
}
 

export class ProdutoApiRepository{

         dateService = new DateService();

    formatDescricao(descricao: string): string {
    return descricao.replace(/'/g, '');
    }

        async inserir( value:inputProdApi ){
          
            const dateService = new DateService();
            return new Promise( async (resolve, reject)=>{

                const { Id, data_envio, codigo_sistema , descricao, saldo, variacao, data_recad_sistema, data_estoque, com_variacao, data_preco} = value;
                let descricaoSemAspas = this.formatDescricao(descricao);

                const sql = ` INSERT INTO ${database_api}.produtos VALUES
                 (
                '${Id}',
                '${descricaoSemAspas}',
                '${codigo_sistema}',
                '${data_envio}', 
                '${saldo}',
                '${variacao}',
                '${data_recad_sistema}',
                '${ data_estoque }',
                '${com_variacao}',
                '${data_preco}' 
                 )` 

                await conn_api.query(sql, (err, result)=>{
                    if(err){
                        console.log("Erro ao tentar inserir produto na banco de dados da integracao   ", err)
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }

       async findSynced():Promise <IProdutoApiSystem[]> {
            return new Promise( async ( resolve, reject )=>{
               const sql = `  

                     SELECT 
                           itp.*,
                            cp.CODIGO,cp.DESCRICAO
                      from ${db_publico}.cad_prod cp
                     JOIN  ${database_api}.produtos AS itp ON  itp.codigo_sistema = cp.CODIGO
                          WHERE cp.NO_SITE = 'S' AND cp.ATIVO = 'S'
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


        async buscaTodos():Promise <IProdutoApiSystem[]> {
            return new Promise( async ( resolve, reject )=>{
               const sql = `  

                     SELECT 
                           itp.*,
                            P.CODIGO,P.DESCRICAO
                      from ${db_publico}.cad_prod P
                          LEFT JOIN  ${database_api}.produtos AS itp ON itp.codigo_sistema = P.CODIGO
                          WHERE P.NO_SITE = 'S' AND P.ATIVO = 'S' order by P.CODIGO
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

        async buscaSincronizados():Promise<IProdutoApi[]>{
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

      async findById( id:string ):Promise <IProdutoApi[]> {
            return new Promise( async ( resolve, reject )=>{
                const sql = ` SELECT * FROM ${database_api}.produtos WHERE  Id = '${id}' ;`
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

        async atualizaSaldoEnviado( id:any, saldo:any, data_estoque:string ){
            return new Promise( async ( resolve, reject )=>{
                const sql = ` UPDATE ${database_api}.produtos set saldo_enviado = ${saldo}, data_estoque = '${data_estoque}'  WHERE  Id = ${id} ;`

                await conn_api.query(sql, (err, result )=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }
        
        
        async updateByParama( param:Partial< inputProdApi>  ){
        
            return new Promise( async ( resolve, reject )=>{
                const sql = ` UPDATE ${database_api}.produtos set  `

                let conditions =[]
                let values= []

                if( param.descricao){
                    conditions.push(' descricao = ? ')
                    values.push( param.descricao);
                }

                if( param.codigo_sistema){
                    conditions.push(' codigo_sistema = ? ')
                    values.push( param.codigo_sistema);
                }
             
                if( param.data_envio){
                    conditions.push(' data_envio = ? ')
                    values.push(  this.dateService.formatarDataHora(param.data_envio));
                }
                if(param.saldo){
                     conditions.push(' saldo_enviado = ? ')
                     values.push(param.saldo)
                }

                if( param.variacao){
                    conditions.push(' variacao = ? ')
                    values.push( param.variacao )
                }
                if( param.com_variacao){
                    conditions.push(' com_variacao = ? ')
                    values.push( param.com_variacao )
                }

                if( param.data_recad_sistema){
                    conditions.push(' data_recad_sistema = ? ')
                    values.push( this.dateService.formatarDataHora(param.data_recad_sistema))
                }

                if( param.data_preco){
                    conditions.push(' data_preco = ? ')
                    values.push( this.dateService.formatarDataHora(param.data_preco))
                }

                 if( param.data_estoque){
                    conditions.push(' data_estoque = ? ')
                    values.push( this.dateService.formatarDataHora(param.data_estoque))
                }

                let finalSql = sql + conditions.join(' , ') + ` WHERE Id = ${param.Id}`
                await conn_api.query(finalSql, values, (err, result )=>{
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

         
        /**
         * 
         * @param codigo codigo da tabela no erp  
         * @returns 
         */
    async buscaTabelasPorCodigo( codigo:number) :Promise<[{ Id:number, codigo_sistema:number, descricao:string, data_envio:string }]> {
            
           const sql =  ` SELECT   *
                        from ${database_api}.tabelas_preco    
                    where codigo_sistema = ${codigo}
                        ; ` 
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

          
        async buscaTabelas() :Promise<[{ Id:number, codigo_sistema:number, descricao:string, data_envio:string }]> {
            
           const sql =  ` SELECT   *
                        from ${database_api}.tabelas_preco    
                        ; ` 
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
        async insertTabela(query:queryInsertTabelaPreco){
            const sql = ` INSERT INTO ${database_api}.tabelas_preco 
                                set
                                Id = '${query.id}',
                                descricao = '${query.descricao}',
                                codigo_sistema = ${query.codigo_sistema},
                                data_envio = '${query.data_envio}';
                            `
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
