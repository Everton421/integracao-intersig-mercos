"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class ProdutoRepository {
    async buscaProdutos() {
        return new Promise(async (resolve, reject) => {
            let sql = ` 
                            SELECT * FROM ${databaseConfig_1.db_publico}.cad_prod WHERE NO_SITE = 'S';
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
    async buscaProduto(codigo) {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${databaseConfig_1.db_publico}.cad_prod WHERE NO_SITE = 'S' AND CODIGO = ${codigo};`;
            await databaseConfig_1.conn.query(sql, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                else {
                    //              resolve(result);
                    resolve(result);
                }
            });
        });
    }
    async buscaEstoqueReal(codigo, setor) {
        return new Promise(async (resolve, reject) => {
            const sql = `
                  SELECT  
                        est.CODIGO,
                        IF(est.estoque < 0, 0, est.estoque) AS ESTOQUE,
                        est.DATA_RECAD
                      FROM 
                        (SELECT
                          P.CODIGO,
                          PS.DATA_RECAD,
                          (SUM(PS.ESTOQUE) - 
                            (SELECT COALESCE(SUM((IF(PO.QTDE_SEPARADA > (PO.QUANTIDADE - PO.QTDE_MOV), PO.QTDE_SEPARADA, (PO.QUANTIDADE - PO.QTDE_MOV)) * PO.FATOR_QTDE) * IF(CO.TIPO = '5', -1, 1)), 0)
                              FROM ${databaseConfig_1.db_vendas}.cad_orca AS CO
                              LEFT OUTER JOIN ${databaseConfig_1.db_vendas}.pro_orca AS PO ON PO.ORCAMENTO = CO.CODIGO
                              WHERE CO.SITUACAO IN ('AI', 'AP', 'FP')
                              AND PO.PRODUTO = P.CODIGO)) AS estoque
                        FROM ${databaseConfig_1.db_estoque}.prod_setor AS PS
                        LEFT JOIN ${databaseConfig_1.db_publico}.cad_prod AS P ON P.CODIGO = PS.PRODUTO
                        INNER JOIN ${databaseConfig_1.db_publico}.cad_pgru AS G ON P.GRUPO = G.CODIGO
                        LEFT JOIN ${databaseConfig_1.db_estoque}.setores AS S ON PS.SETOR = S.CODIGO
                        WHERE P.CODIGO = ${codigo}
                        AND PS.SETOR = ${setor}
                        GROUP BY P.CODIGO) AS est;
                  `;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                    console.log('erro ao obter o saldo de estoque');
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaTabelaDePreco() {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM ${databaseConfig_1.db_publico}.tab_precos ORDER BY CODIGO DESC ;
                          `;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                    console.log('erro ao obter o tabela de preco');
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaPreco(produto, tabela) {
        const sql = ` SELECT pp.PRECO, pp.PRODUTO, pp.TABELA, pp.DATA_RECAD   from ${databaseConfig_1.db_publico}.prod_tabprecos pp
                  join ${databaseConfig_1.db_publico}.tab_precos tp on tp.codigo = pp.tabela 
                  where pp.PRODUTO = ${produto} and tp.CODIGO = ${tabela}   
                ; `;
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
    async buscaFotos(produto) {
        const sql = `  
        SELECT  CAST(FOTO  AS CHAR(1000)  CHARACTER SET utf8)  FOTO  from ${databaseConfig_1.db_publico}.fotos_prod where  PRODUTO = ${produto};    
                ; `;
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
    async buscaCaminhoFotos() {
        const sql = `  
      SELECT  CAST(FOTOS AS CHAR(1000)  CHARACTER SET utf8)  FOTOS from ${databaseConfig_1.db_vendas}.parametros;   
                ; `;
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
    async buscaNcm(codigo) {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT CODIGO  , NCM  , COD_CEST   FROM ${databaseConfig_1.db_publico}.class_fiscal where CODIGO=${codigo};`;
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
    async buscaUnidades(codigo) {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT  PRODUTO, DESCRICAO, SIGLA  FROM ${databaseConfig_1.db_publico}.unid_prod where PRODUTO = ${codigo} AND item = 1 ;`;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    console.log(`Ocorreu um erro ao tentar consultar as unidade de medido do produto: ${codigo}`, err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.ProdutoRepository = ProdutoRepository;
