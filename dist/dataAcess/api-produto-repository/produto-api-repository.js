"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoApiRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
const date_service_1 = require("../../Services/dateService/date-service");
class ProdutoApiRepository {
    constructor() {
        this.dateService = new date_service_1.DateService();
    }
    formatDescricao(descricao) {
        return descricao.replace(/'/g, '');
    }
    async inserir(value) {
        const dateService = new date_service_1.DateService();
        return new Promise(async (resolve, reject) => {
            const { id_bling, data_envio, codigo_sistema, descricao, saldo, variacao, data_recad_sistema, data_estoque, com_variacao, data_preco } = value;
            let descricaoSemAspas = this.formatDescricao(descricao);
            const sql = ` INSERT INTO ${databaseConfig_1.database_api}.produtos VALUES
                 (
                '${id_bling}',
                '${descricaoSemAspas}',
                '${codigo_sistema}',
                '${data_envio}', 
                '${saldo}',
                '${variacao}',
                '${data_recad_sistema}',
                '${data_estoque}',
                '${com_variacao}',
                '${data_preco}' 
                 )`;
            await databaseConfig_1.conn_api.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao tentar inserir produto na banco de dados da integracao   ", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaTodos() {
        return new Promise(async (resolve, reject) => {
            const sql = `  

                     SELECT 
                           itp.*,
                            P.CODIGO,P.DESCRICAO
                      from ${databaseConfig_1.db_publico}.cad_prod P
                          LEFT JOIN  ${databaseConfig_1.database_api}.produtos AS itp ON itp.codigo_sistema = P.CODIGO
                          WHERE P.NO_SITE = 'S' AND P.ATIVO = 'S'
                ;`;
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
    async buscaSincronizados() {
        return new Promise(async (resolve, reject) => {
            const sql = `  SELECT * FROM ${databaseConfig_1.database_api}.produtos ;`;
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
    async findByIdBling(id) {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM ${databaseConfig_1.database_api}.produtos WHERE  Id_bling = '${id}' ;`;
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
    async findByCodeSystem(codigo) {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM ${databaseConfig_1.database_api}.produtos WHERE  codigo_sistema = ${codigo} ;`;
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
    async atualizaSaldoEnviado(id, saldo, data_estoque) {
        return new Promise(async (resolve, reject) => {
            const sql = ` UPDATE ${databaseConfig_1.database_api}.produtos set saldo_enviado = ${saldo}, data_estoque = '${data_estoque}'  WHERE  Id_bling = ${id} ;`;
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
    async updateByParama(param) {
        if (!param.id_bling) {
            console.log("É necessario informar o id do produto para atualizar o produto no banco de dados ");
            return;
        }
        return new Promise(async (resolve, reject) => {
            const sql = ` UPDATE ${databaseConfig_1.database_api}.produtos set  `;
            let conditions = [];
            let values = [];
            if (param.descricao) {
                conditions.push(' descricao = ? ');
                values.push(param.descricao);
            }
            if (param.codigo_sistema) {
                conditions.push(' codigo_sistema = ? ');
                values.push(param.codigo_sistema);
            }
            if (param.data_envio) {
                conditions.push(' data_envio = ? ');
                values.push(this.dateService.formatarDataHora(param.data_envio));
            }
            if (param.saldo) {
                conditions.push(' saldo_enviado = ? ');
                values.push(param.saldo);
            }
            if (param.variacao) {
                conditions.push(' variacao = ? ');
                values.push(param.variacao);
            }
            if (param.com_variacao) {
                conditions.push(' com_variacao = ? ');
                values.push(param.com_variacao);
            }
            if (param.data_recad_sistema) {
                conditions.push(' data_recad_sistema = ? ');
                values.push(this.dateService.formatarDataHora(param.data_recad_sistema));
            }
            if (param.data_preco) {
                conditions.push(' data_preco = ? ');
                values.push(this.dateService.formatarDataHora(param.data_preco));
            }
            if (param.data_estoque) {
                conditions.push(' data_estoque = ? ');
                values.push(this.dateService.formatarDataHora(param.data_estoque));
            }
            let finalSql = sql + conditions.join(' , ') + ` WHERE Id_bling = ${param.id_bling}`;
            await databaseConfig_1.conn_api.query(finalSql, values, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async findDefaultDeposit() {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM ${databaseConfig_1.database_api}.depositos WHERE  padrao = 'S' ;`;
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
    async insertDeposit(value) {
        const dateService = new date_service_1.DateService();
        return new Promise(async (resolve, reject) => {
            const { id_bling, descricao, padrao, situacao } = value;
            let descricaoSemAspas = this.formatDescricao(descricao);
            const sql = ` INSERT INTO ${databaseConfig_1.database_api}.depositos VALUES ('${id_bling}','${descricao}','${situacao}', '${padrao}')`;
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
}
exports.ProdutoApiRepository = ProdutoApiRepository;
