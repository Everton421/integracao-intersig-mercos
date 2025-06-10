"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteApiRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class ClienteApiRepository {
    data() {
        const now = new Date(); // Obtém a data e hora atuais
        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
        const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const dataHoraInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
        const dataInsercao = `${ano}-${mes}-${dia}`;
        return { dataHoraInsercao, dataInsercao };
    }
    async cadastrarClientApi(json) {
        const { id_bling, codigoCliente, cpf } = json;
        let dataInsercao = this.data().dataHoraInsercao;
        return new Promise(async (resolve, reject) => {
            const sql = ` INSERT INTO ${databaseConfig_1.database_api}.clientes  (Id_bling, codigo_sistema, cpf, data_envio) 
                    values ('${id_bling}', '${codigoCliente}', '${cpf}', '${dataInsercao}' );
                    
                `;
            await databaseConfig_1.conn_api.query(sql, (err, result) => {
                if (err) {
                    console.log(" Erro ao inserir o cliente na tabela da api ", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async getClientIntegracao() {
        return new Promise((resolve, reject) => {
            let sql = ` SELECT 
                                c.Id_bling,
                                c.codigo_sistema,
                                clie.CPF cpf,
                                clie.NOME as nome 
                                FROM 
                               ${databaseConfig_1.db_api}.clientes  c
                                join ${databaseConfig_1.db_publico}.cad_clie clie
                                 on  c.codigo_sistema = clie.CODIGO
                                `;
            databaseConfig_1.conn_api.query(sql, (err, result) => {
                if (err) {
                    console.log(" erro ao buscar dados do cliente ");
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.ClienteApiRepository = ClienteApiRepository;
