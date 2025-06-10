"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfigRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class ApiConfigRepository {
    async buscaConfig() {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM ${databaseConfig_1.database_api}.config;`;
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
    async atualizaDados(json) {
        return new Promise(async (resolve, reject) => {
            let BaseSql = `
                UPDATE ${databaseConfig_1.database_api}.config set   
            `;
            let conditions = [];
            let values = [];
            if (json.enviar_estoque) {
                conditions.push(' enviar_estoque = ? ');
                values.push(Number(json.enviar_estoque));
            }
            if (json.enviar_precos) {
                conditions.push(' enviar_precos = ? ');
                values.push(Number(json.enviar_precos));
            }
            if (json.enviar_produtos) {
                conditions.push(' enviar_produtos = ? ');
                values.push(json.enviar_produtos);
            }
            if (json.importar_pedidos) {
                conditions.push(' importar_pedidos = ? ');
                values.push(Number(json.importar_pedidos));
            }
            if (json.tabela_preco) {
                conditions.push(' tabela_preco = ? ');
                values.push(Number(json.tabela_preco));
            }
            if (json.vendedor) {
                conditions.push(' vendedor = ? ');
                values.push(Number(json.vendedor));
            }
            let finalSql = '';
            let whereClause = ' WHERE  ID = 1;';
            if (conditions.length > 0) {
                finalSql = BaseSql + conditions.join(' , ') + whereClause;
            }
            await databaseConfig_1.conn.query(finalSql, values, (err, result) => {
                if (err) {
                    console.log("erro ao tentar atualizar as configurações da integracao ", err);
                    reject(err);
                }
                else {
                    console.log('configurações atualizados com sucesso! ', result);
                    resolve(result);
                }
            });
            //  console.log(sql)
        });
    }
}
exports.ApiConfigRepository = ApiConfigRepository;
