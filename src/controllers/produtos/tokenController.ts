import axios from "axios";
import { conn_api, database_api } from "../../database/databaseConfig";
import { NextFunction, Request, Response } from "express";
export class TokenController{

   async insereToken(json:any, database:any){
    return new Promise(async (resolve, reject) => {
      const {
          access_token,
          refresh_token,
          expires_in,
      } = json;

      const now = new Date(); // Obtém a data e hora atuais

      const dia = String(now.getDate()).padStart(2, '0');
      const mes = String(now.getMonth() + 1).padStart(2, '0');
      const ano = now.getFullYear();

      const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
      const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
      const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10

      const dataInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

      const sql = `INSERT INTO ${database}.tokens (id, token, refresh_token, expires_in, ult_atualizacao) VALUES (1, '${access_token}', '${refresh_token}','${expires_in}','${dataInsercao}') 
                   ON DUPLICATE KEY UPDATE token = VALUES(token), refresh_token = VALUES(refresh_token), expires_in = VALUES(expires_in),  ult_atualizacao = VALUES(ult_atualizacao);`;

      await conn_api.query(sql, (err, response) => {
          if (err) {
              reject(err);
          } else {
              resolve(response.insertID);
          }
      });
  });
    }

   async obterToken(req:Request ,res:Response, next:NextFunction){
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const urlBling = process.env.BASE_URL
  
    const code:any = req.query.code;

    const base64Credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

    const headers = {
        'Host': 'www.bling.com.br',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '1.0',
        'Authorization': `Basic ${base64Credentials}`
    };

    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('code', code);

    try {
        const apiToken = await axios.post(`${urlBling}/oauth/token`, data, { headers });
       // console.log(apiToken.data); // Se desejar, imprima a resposta
        console.log(apiToken.data)
        //res.status(200).json(apiToken.data); // Retorna a resposta como JSON
        if( apiToken.status === 200){
         try{
          let dadosinseridos = await this.insereToken(apiToken.data, database_api);
            
            
              //res.status(200).json('token inserido com sucesso ');
              res.redirect('/')
            
        }catch(err){
          console.log(err)

        }
       // console.log(apiToken.data)
 
        }

//         let dadosinseridos = this.insereToken(apiToken.data);
  //       res.status(200).json(dadosinseridos); // Retorna a resposta como JSON
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter o token de API' }); // Retorna um erro 500 em caso de falha
    } 
   }
    
async  buscaToken(){
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


  // valida se o token esta valido com base na data de criação e no tempo de expiração
    // retornando true para token valido
    // e false para token invalido
     verificaExpiracao(token: any) {
        const now = new Date();
        const dataAtual = now.getTime(); // Obtém o timestamp atual em milissegundos
    
        const dataToken = new Date(token.ult_atualizacao).getTime(); // Obtém o timestamp da última atualização do token em milissegundos
    
        const expires_in = token.expires_in * 1000; // Converte o tempo de expiração em segundos para milissegundos
    
        // Calcula o timestamp do momento em que o token expirará
        const dataExpiracao = dataToken + expires_in;
    
        // Verifica se a data atual é menor que a data de expiração do token
        const tokenValido = dataAtual < dataExpiracao;

        return tokenValido;
        //console.log
    }   


}