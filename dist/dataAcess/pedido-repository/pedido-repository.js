"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRepository = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
const pedido_mapper_1 = require("../../mappers/pedido-mapper");
const pedido_api_repository_1 = require("../api-pedido-repository/pedido-api-repository");
class PedidoRepository {
    constructor() {
        this.mapper = new pedido_mapper_1.PedidoMapper();
    }
    /**
     *
     * @param produtos produtos do pedido a serem processados
     * @param codigoPedido codigo do pedido
     * @returns
     */
    async cadastraProdutosDoPedido(produtos, codigoPedido) {
        return new Promise(async (resolve, reject) => {
            let i = 1;
            for (const prod of produtos) {
                const prodMapper = this.mapper.proOrcaMapper(prod, codigoPedido, i);
                const sql = ` INSERT INTO ${databaseConfig_1.db_vendas}.pro_orca  SET
				orcamento = '${codigoPedido}',
				sequencia = '${prodMapper.SEQUENCIA}',
				produto = '${prodMapper.PRODUTO}',
				grade = '${prodMapper.GRADE}',
				padronizado ='${prodMapper.PADRONIZADO}',
				complemento = '${prodMapper.COMPLEMENTO}',
				unidade = '${prodMapper.UNIDADE}',   
				item_unid = '${prodMapper.ITEM_UNID}',
				just_ipi = '${prodMapper.JUST_IPI}',
				just_icms = '${prodMapper.JUST_ICMS}',
				just_subst = '${prodMapper.JUST_SUBST}',
				quantidade = '${prodMapper.QUANTIDADE}',
				unitario ='${prodMapper.UNITARIO}',
				tabela = '${prodMapper.UNITARIO}',
				preco_tabela = '${prodMapper.UNITARIO}',
				CUSTO_MEDIO = '${prodMapper.CUSTO_MEDIO}',
				ULT_CUSTO = '${prodMapper.ULT_CUSTO}',
				FRETE = '${prodMapper.FRETE}',
				ipi = '${prodMapper.IPI}',
				desconto = '${prodMapper.DESCONTO}'
			`;
                await databaseConfig_1.conn.query(sql, (error, resultado) => {
                    if (error) {
                        reject(" erro ao inserir produto do orcamento " + error);
                    }
                    else {
                        resolve(resultado);
                        console.log(`produto  inserido com sucesso`);
                    }
                });
                if (i === produtos.length) {
                    return;
                }
                i++;
            }
        });
    }
    /**
     *
     * @param parcelas array com as parcelas a serem processadas
     * @param codigoPedido codigo do pedido
     * @returns
     */
    async cadastraParcelasDoPedido(parcelas, codigoPedido) {
        return new Promise(async (resolve, reject) => {
            for (const parcela of parcelas) {
                let i = 1;
                const sql = ` INSERT INTO ${databaseConfig_1.db_vendas}.par_orca (orcamento, parcela, valor, vencimento, tipo_receb) VALUES 
			('${codigoPedido}','${i}',${parcela.valor}, '${parcela.dataVencimento}', '1');
			`;
                await databaseConfig_1.conn.query(sql, (err, result) => {
                    if (err) {
                        console.log(' erro ao tentar cadastrar parcelas do pedido ', err);
                        reject(err);
                    }
                    else {
                        //console.log(result)
                        resolve(result);
                    }
                });
                if (i === parcelas.length) {
                    return;
                }
                i++;
            }
        });
    }
    /**
     *
     * @param pedido pedido a ser registrado nas tabelas do sistema
     * @param cliente codigo do cliente
     * @param vendedor codigo do vendedor
     * @returns
     */
    async cadastrarPedido(pedido, cliente, vendedor) {
        const pedidoApi = new pedido_api_repository_1.PedidoApiRepository();
        const { parcelas, itens } = pedido;
        const cad_orca = this.mapper.cadOrcaMapper(pedido, cliente, vendedor, parcelas.length);
        let totalProdutos = 0; // Inicializando a variável totalProdutos
        itens.forEach((iten) => {
            totalProdutos += (iten.valor * iten.quantidade); // - iten.desconto;
        });
        console.log(totalProdutos); // Exibindo o total dos produtos
        let codigoPedido;
        return new Promise(async (resolve, reject) => {
            const sql = ` 
			INSERT INTO ${databaseConfig_1.db_vendas}.cad_orca (status,  cliente, total_produtos, desc_prod ,total_geral, data_pedido, valor_frete, situacao, data_cadastro, hora_cadastro, data_inicio, hora_inicio, vendedor, contato, observacoes, observacoes2, tipo,  NF_ENT_OS, RECEPTOR, VAL_PROD_MANIP, PERC_PROD_MANIP, 
				PERC_SERV_MANIP, REVISAO_COMPLETA, DESTACAR, TABELA, QTDE_PARCELAS, ALIQ_ISSQN, 
				OUTRAS_DESPESAS, PESO_LIQUIDO, BASE_ICMS_UF_DEST, FORMA_PAGAMENTO)
				VALUES (
					'${cad_orca.STATUS}',
					'${cad_orca.CLIENTE}',
					'${cad_orca.TOTAL_PRODUTOS}',
					'${cad_orca.DESC_PROD}',
					'${cad_orca.TOTAL_GERAL}',
					'${cad_orca.DATA_PEDIDO}',
					'${cad_orca.VALOR_FRETE}',
					'${cad_orca.SITUACAO}',
					'${cad_orca.DATA_CADASTRO}',
					'${cad_orca.HORA_CADASTRO}',
					'${cad_orca.DATA_INICIO}',
					'${cad_orca.HORA_INICIO}',
					'${cad_orca.VENDEDOR}',
					'${cad_orca.CONTATO}',
					'${cad_orca.OBSERVACOES}',
					'${cad_orca.OBSERVACOES2}',
					'${cad_orca.TIPO}',
					'${cad_orca.NF_ENT_OS}',
					'${cad_orca.RECEPTOR}',
					'${cad_orca.VAL_PROD_MANIP}',
					'${cad_orca.PERC_PROD_MANIP}',
					'${cad_orca.PERC_SERV_MANIP}',
					'${cad_orca.REVISAO_COMPLETA}',
					'${cad_orca.DESTACAR}',
					'${cad_orca.TABELA}',
					'${cad_orca.QTDE_PARCELAS}',
					'${cad_orca.ALIQ_ISSQN}',
					'${cad_orca.OUTRAS_DESPESAS}',
					'${cad_orca.PESO_LIQUIDO}',
					'${cad_orca.BASE_ICMS_UF_DEST}',
					'${cad_orca.FORMA_PAGAMENTO}'
						);     
			`;
            await databaseConfig_1.conn.query(sql, async (err, result) => {
                if (err) {
                    reject(" erro ao cadastrar orcamento" + err);
                }
                else {
                    codigoPedido = result.insertId;
                    console.log(codigoPedido);
                    resolve(result);
                    let json = { "Id_bling": pedido.id, "codigo_sistema": codigoPedido, 'situacao': cad_orca.SITUACAO };
                    try {
                        const result = await pedidoApi.cadastraPedidoApi(json);
                    }
                    catch (err) {
                        console.log(" erro ao cadastrar na tabela da api" + err);
                    }
                    let resultProdutos;
                    try {
                        resultProdutos = await this.cadastraProdutosDoPedido(itens, codigoPedido);
                    }
                    catch (err) {
                        console.log(err);
                        return;
                    }
                    try {
                        await this.cadastraParcelasDoPedido(parcelas, codigoPedido);
                    }
                    catch (err) {
                        console.log("ocorreu um erro ao tentar gravar as parcelas  ", err);
                        return;
                    }
                }
            });
        });
    }
    /**
     * obtem todas as informações do pedido contidas na tabela cad_orca
     * @param codigo codigo do pedido
     * @returns
     */
    async findByCode(codigo) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${databaseConfig_1.db_vendas}.cad_orca WHERE CODIGO = ${codigo}`;
            databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao consultar a tabela cad_orca ", err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.PedidoRepository = PedidoRepository;
