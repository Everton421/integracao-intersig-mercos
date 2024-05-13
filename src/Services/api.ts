import axios from "axios";
import { TokenModelo } from "../models/token/tokenModelo";
import { conn_api, database_api } from "../database/databaseConfig";

async  function buscaToken(){
    const sql = `SELECT * FROM ${database_api}.tokens WHERE id = 1`;
    return new Promise( async (resolve, reject)=>{
        await conn_api.query(sql, (err, result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
    })
})
}
const token =   buscaToken();


const url_bling = process.env.BASE_URL
export const api = axios.create({
    baseURL: url_bling,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer e67ac9db95a854d413d874c14b713348c130b9cd`
    }
});
