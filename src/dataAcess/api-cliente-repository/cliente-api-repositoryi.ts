import {    conn_api, database_api, db_api, db_publico } from "../../database/databaseConfig";
import { DateService } from "../../Services/dateService/date-service";
 type OkPacket = {
  fieldCount: number,
  affectedRows: number,
  insertId: number,
  serverStatus: number,
  warningCount: number,
  message: string,
  protocol41: boolean,
  changedRows: number
}


export class ClienteApiRepository{

    private dateService = new DateService();

    async cadastrarClientApi( json:{ id:number, codigoCliente:number, cpf:string } ):Promise<OkPacket>{
        const {
            id , codigoCliente, cpf
        } = json;

            let dataInsercao:any = this.dateService.obterDataHoraAtual();


        return new Promise( async (resolve, reject )=>{
                const sql = ` INSERT INTO ${database_api}.clientes  (Id, codigo_sistema, cpf, data_envio) 
                    values ('${id}', '${codigoCliente}', '${cpf}', '${dataInsercao}' );
                    
                `
            await conn_api.query(sql,(err, result)=>{
                if(err){
                    console.log(" Erro ao inserir o cliente na tabela da api ", err)
                    reject(err);
                }else{
                    resolve(result);
                }

            })
        })

    }

        async getClientIntegracao():Promise<[{ Id:number ,codigo_sistema:number, cpf:string,nome:string }]>{
            return new Promise( ( resolve, reject ) =>{
                let sql = ` SELECT 
                                c.Id,
                                c.codigo_sistema,
                                clie.CPF cpf,
                                clie.NOME as nome 
                                FROM 
                               ${db_api}.clientes  c
                                join ${ db_publico }.cad_clie clie
                                 on  c.codigo_sistema = clie.CODIGO
                                ` 
                conn_api.query(sql, ( err, result )=>{
                    if(err){
                        console.log(" erro ao buscar dados do cliente ");
                        reject(err)
                    }else{
                        resolve(result);
                    }
                })

            })
     
        }

            /**
             *  obtem os dados do cliente, faz a relação entre a tabela de clientes da integracao e a tabela do sistema.
             * @param id id do cliente  a ser filtrado
             * @returns 
             */
        async getByID( id:any ):Promise<[{ Id:number ,codigo_sistema:number, cpf:string,nome:string,data_envio:string, data_recad_sistema:string }]>{
                    return new Promise( ( resolve, reject ) =>{
                let sql = ` SELECT 
                                c.Id,
                                  clie.CODIGO as codigo_sistema,
                                clie.CPF cpf,
                                clie.NOME as nome,
                                clie.DATA_RECAD AS data_recad_sistema,
                                c.data_envio
                                FROM 
                               ${db_api}.clientes  c
                               left join ${ db_publico }.cad_clie clie
                                 on  c.codigo_sistema = clie.CODIGO
                                 where c.Id = ? 
                                ` 
                conn_api.query(sql,id, ( err, result )=>{
                    if(err){
                        console.log("  Erro ao consultar o cliente id: ", id);
                        reject(err)
                    }else{
                        resolve(result);
                    }
                })

            })
        }
         async getByIDAndCpf( id:any , cnpj:string ):Promise<[{ Id:number ,codigo_sistema:number, cpf:string,nome:string }]>{
                    return new Promise( async ( resolve, reject ) =>{
                
                        let sql = ` SELECT 
                                c.Id,
                                c.codigo_sistema,
                                clie.CPF cpf,
                                clie.NOME as nome 
                                FROM 
                               ${db_api}.clientes  c
                                join ${ db_publico }.cad_clie clie
                                 on  c.codigo_sistema = clie.CODIGO
                                 where c.Id = ? and clie.CPF = ? 
                                ` 
                                const dados = [ id, cnpj];

        await   conn_api.query(sql,  dados, ( err, result )=>{
                    if(err){
                        console.log("  Erro ao consultar o cliente id: ", id);
                        reject(err)
                    }else{
                        resolve(result);
                    }
                })

            })
        }
    }    