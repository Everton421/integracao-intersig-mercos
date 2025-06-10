"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTokenRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
const date_service_1 = require("../../Services/dateService/date-service");
class ApiTokenRepository {
    constructor() {
        this.dateService = new date_service_1.DateService();
    }
    async insereToken(json, database) {
        return new Promise(async (resolve, reject) => {
            const { access_token, refresh_token, expires_in, } = json;
            const dataInsercao = this.dateService.obterDataHoraAtual();
            const sql = `INSERT INTO ${database}.tokens (id, token, refresh_token, expires_in, ult_atualizacao) VALUES (1, '${access_token}', '${refresh_token}','${expires_in}','${dataInsercao}') 
                   ON DUPLICATE KEY UPDATE token = VALUES(token), refresh_token = VALUES(refresh_token), expires_in = VALUES(expires_in),  ult_atualizacao = VALUES(ult_atualizacao);`;
            await databaseConfig_1.conn_api.query(sql, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response.insertID);
                }
            });
        });
    }
    async buscaToken() {
        const sql = `SELECT * FROM ${databaseConfig_1.database_api}.tokens WHERE Id = 1`;
        return new Promise(async (resolve, reject) => {
            await databaseConfig_1.conn_api.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    // valida se o token esta valido com base na data de criação e no tempo de expiração
    // retornando true para token valido
    // e false para token invalido
    verificaExpiracao(token) {
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
exports.ApiTokenRepository = ApiTokenRepository;
