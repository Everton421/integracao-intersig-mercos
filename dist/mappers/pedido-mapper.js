"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoMapper = void 0;
const date_service_1 = require("../Services/dateService/date-service");
class PedidoMapper {
    constructor() {
        this.dateService = new date_service_1.DateService();
    }
    cadOrcaMapper(pedido, codigoCliente, vendedor, qtdParcelas) {
        const data_cadastro = this.dateService.obterDataAtual();
        const hora_cadastro = this.dateService.obterHoraAtual();
        let situacao = 'EA';
        if (pedido.situacao.id === 9) {
            situacao = 'FI';
        }
        const order = {
            COD_SITE: pedido.id,
            STATUS: 0,
            CLIENTE: codigoCliente,
            TOTAL_PRODUTOS: pedido.totalProdutos,
            DESC_PROD: pedido.desconto.valor,
            TOTAL_GERAL: pedido.total,
            DATA_PEDIDO: pedido.data,
            VALOR_FRETE: pedido.transporte.frete,
            SITUACAO: situacao,
            DATA_CADASTRO: data_cadastro,
            HORA_CADASTRO: hora_cadastro,
            DATA_INICIO: data_cadastro,
            HORA_INICIO: hora_cadastro,
            VENDEDOR: vendedor,
            CONTATO: '',
            OBSERVACOES: '',
            OBSERVACOES2: '',
            TIPO: 1,
            NF_ENT_OS: '',
            RECEPTOR: '',
            VAL_PROD_MANIP: pedido.totalProdutos,
            PERC_PROD_MANIP: 0,
            PERC_SERV_MANIP: 100,
            REVISAO_COMPLETA: 'N',
            DESTACAR: 'N',
            TABELA: 'P',
            QTDE_PARCELAS: qtdParcelas,
            ALIQ_ISSQN: 0,
            OUTRAS_DESPESAS: pedido.outrasDespesas,
            PESO_LIQUIDO: 0,
            BASE_ICMS_UF_DEST: 0,
            FORMA_PAGAMENTO: 0,
        };
        return order;
    }
    proOrcaMapper(produto, codigoPedido, sequencia) {
        const prod = {
            ORCAMENTO: codigoPedido,
            SEQUENCIA: sequencia,
            PRODUTO: produto.codigo,
            GRADE: 0,
            PADRONIZADO: 0,
            COMPLEMENTO: '',
            UNIDADE: produto.unidade,
            ITEM_UNID: 1,
            JUST_IPI: '',
            JUST_ICMS: '',
            JUST_SUBST: '',
            QUANTIDADE: produto.quantidade,
            UNITARIO: produto.valor,
            TABELA: produto.valor,
            PRECO_TABELA: produto.valor,
            CUSTO_MEDIO: 0,
            ULT_CUSTO: 0,
            FRETE: 0,
            IPI: 0,
            DESCONTO: 0
        };
        return prod;
    }
}
exports.PedidoMapper = PedidoMapper;
