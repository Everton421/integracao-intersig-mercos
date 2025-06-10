"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaApiRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
const date_service_1 = require("../../Services/dateService/date-service");
class CategoriaApiRepository {
    constructor() {
        this.dateService = new date_service_1.DateService();
    }
    formatDescricao(descricao) {
        return descricao.replace(/'/g, '');
    }
    async buscaCategoriasApi() {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT * FROM ${databaseConfig_1.database_api}.categorias ;
             `;
            await databaseConfig_1.conn_api.query(sql, (err, result) => {
                if (err) {
                    console.log('erro ao buscar categorias enviadas ', err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaCategoriaApi(codigo) {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT * FROM ${databaseConfig_1.database_api}.categorias WHERE codigo_sistema = ? ;
             `;
            await databaseConfig_1.conn_api.query(sql, [codigo], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async cadastraCategoriaApi(value) {
        return new Promise(async (resolve, reject) => {
            let dataInsercao = this.dateService.obterDataHoraAtual();
            const { id_bling, codigo_sistema, descricao } = value;
            let descricaoSemAspas = this.formatDescricao(descricao);
            const sql = ` INSERT INTO ${databaseConfig_1.database_api}.categorias VALUES ('${id_bling}','${descricaoSemAspas}','${codigo_sistema}', '${dataInsercao}')`;
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
exports.CategoriaApiRepository = CategoriaApiRepository;
