"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoApiRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
const date_service_1 = require("../../Services/dateService/date-service");
class PedidoApiRepository {
    constructor() {
        this.dateService = new date_service_1.DateService();
    }
    async validaPedido(id) {
        const sql = `SELECT * FROM ${databaseConfig_1.database_api}.pedidos where Id_bling = ${id};`;
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
    /**
     * Obtem dados do pedido
     * @returns
     */
    async findAll() {
        const sql = `SELECT 
            p.*,
            c.NOME as nome ,
            co.TOTAL_GERAL as total_geral  
             FROM ${databaseConfig_1.database_api}.pedidos p
                   join ${databaseConfig_1.db_vendas}.cad_orca co on co.CODIGO = p.codigo_sistema
                   join ${databaseConfig_1.db_publico}.cad_clie c on c.CODIGO = co.CLIENTE 
            ;`;
        return new Promise(async (resolve, reject) => {
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async cadastraPedidoApi(json) {
        return new Promise(async (resolve, reject) => {
            const { Id_bling, codigo_sistema, situacao } = json;
            const data = this.dateService.obterDataHoraAtual();
            const sql = ` INSERT INTO ${databaseConfig_1.database_api}.pedidos values ('${Id_bling}', '${codigo_sistema}', '${data}' , '${situacao}')`;
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
    async updateBYParam(dados) {
        if (!dados.Id_bling)
            return console.log(`è necessario informar o id do pedido para atualziar a tabela de pedidos da integracao`);
        return new Promise((resolve, reject) => {
            let sql = ` UPDATE ${databaseConfig_1.db_api}.pedidos SET `;
            let conditions = [];
            let values = [];
            if (dados.codigo_sistema) {
                conditions.push(' codigo_sistema = ? ');
                values.push(dados.codigo_sistema);
            }
            if (dados.situacao) {
                conditions.push(' situacao = ? ');
                values.push(dados.situacao);
            }
            const whereClause = ' WHERE Id_bling = ? ';
            values.push(dados.Id_bling);
            let finalSql = sql;
            if (conditions.length > 0) {
                finalSql = sql + conditions.join(' , ') + whereClause;
            }
            databaseConfig_1.conn_api.query(finalSql, values, (err, result) => {
                if (err) {
                    console.log(`Erro ao tentar atualizar o pedido no banco de dados da integração`, err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.PedidoApiRepository = PedidoApiRepository;
