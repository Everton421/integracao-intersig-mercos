import { promises } from "form-data";
import { conn_api, db_api, db_publico } from "../../database/databaseConfig";

export class FormaPagamentoRepository{

    /**
     * obtem as formas de pagamentos sincronizadas
     */
    async findSyncedFpgt()  :Promise< [ { Id:number, CODIGO:number, NUM_PARCELAS:number,  INTERVALO:number,DIAS_ENTRADA:number } ] >{
        return new Promise(( resolve, reject )=>{
            const sql = `
             select 
                 Ifpgt.Id,
                fpgt.CODIGO,
                fpgt.NUM_PARCELAS,
                fpgt.INTERVALO,
                fpgt.DIAS_ENTRADA
             from ${db_api}.forma_pagamento Ifpgt 
            join ${db_publico}.cad_fpgt fpgt on Ifpgt.codigo = fpgt.CODIGO
                `
            conn_api.query(sql,  (err, result)=>{
                 if(err){
                    console.log("Ocorreu um erro ao tentar buscar formas de pagamento ",err)
                    reject(err);
                }else{
                    //console.log(result);
                    resolve(result);
                 } 
            })

        })
    }

    async findSyncedFpgtById(id:any) :Promise< [ { Id:number, CODIGO:number, NUM_PARCELAS:number,  INTERVALO:number,DIAS_ENTRADA:number } ] >{

        return new Promise(( resolve, reject )=>{
            const sql = `
             select 
                Ifpgt.Id,
                fpgt.CODIGO,
                fpgt.NUM_PARCELAS,
                fpgt.INTERVALO,
                fpgt.DIAS_ENTRADA
             from ${db_api}.forma_pagamento Ifpgt 
            join ${db_publico}.cad_fpgt fpgt on Ifpgt.codigo = fpgt.CODIGO
            where Ifpgt.Id = ? 
                `
            conn_api.query(sql, id ,(err, result)=>{
                 if(err){
                    console.log(`Ocorreu um erro ao tentar buscar forma de pagamento id: ${ id } `,err)
                    reject(err);
                }else{
                    //console.log(result);
                    resolve(result);
                 } 
            })

        })
    }

    async findSyncedFpgtByCode(code:any):Promise< [ { Id:number, CODIGO:number, NUM_PARCELAS:number,  INTERVALO:number,DIAS_ENTRADA:number } ] >{
        return new Promise(( resolve, reject )=>{
            const sql = `
             select 
                  Ifpgt.Id,
                fpgt.CODIGO,
                fpgt.NUM_PARCELAS,
                fpgt.INTERVALO,
                fpgt.DIAS_ENTRADA 
             from ${db_api}.forma_pagamento Ifpgt 
            join ${db_publico}.cad_fpgt fpgt on Ifpgt.codigo = fpgt.CODIGO
            where Ifpgt.codigo = ? 
                `
            conn_api.query(sql, code ,(err, result)=>{
                 if(err){
                    console.log(`Ocorreu um erro ao tentar buscar forma de pagamento codigo: ${ code } `,err)
                    reject(err);
                }else{
                    //console.log(result);
                    resolve(result);
                 } 
            })

        })
    }
}