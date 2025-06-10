"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class CategoriaRepository {
    async buscaGrupos() {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT * FROM ${databaseConfig_1.db_publico}.cad_pgru;
             `;
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
    async buscaGrupo(grupo) {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT * FROM ${databaseConfig_1.db_publico}.cad_pgru WHERE CODIGO = ?;
             `;
            await databaseConfig_1.conn.query(sql, [grupo], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaGrupoIndex() {
        return new Promise(async (resolve, reject) => {
            const sql = `  SELECT 
            itc.Id_bling,
            pg.CODIGO codigo_sistema,
            pg.NOME nome
       from ${databaseConfig_1.db_publico}.cad_pgru pg 
        left join ${databaseConfig_1.db_api}.categorias  itc 
         on itc.codigo_sistema = pg.CODIGO 
            `;
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
}
exports.CategoriaRepository = CategoriaRepository;
