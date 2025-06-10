import { cad_orca } from "../interfaces/cad_orca";
import { pro_orca } from "../interfaces/pro_orca";
import { DateService } from "../Services/dateService/date-service";

export class PedidoMapper{
        dateService = new DateService();

    cadOrcaMapper( pedido:any, codigoCliente:number, vendedor:number,qtdParcelas:number ){
       
             const data_cadastro = this.dateService.obterDataAtual();
             const hora_cadastro = this.dateService.obterHoraAtual(); 
             
                
                 let situacao = 'EA'
                if( pedido.situacao.id === 9){
                    situacao = 'FI'
                }

             const order:cad_orca = {
                     COD_SITE: pedido.id,
                    STATUS:0,
                    CLIENTE: codigoCliente,
                    TOTAL_PRODUTOS: pedido.totalProdutos,
                    DESC_PROD:pedido.desconto.valor,
                    TOTAL_GERAL: pedido.total,
                    DATA_PEDIDO:pedido.data,
                    VALOR_FRETE:pedido.transporte.frete,
                    SITUACAO: situacao,
                    DATA_CADASTRO:data_cadastro,
                    HORA_CADASTRO:hora_cadastro,
                    DATA_INICIO:data_cadastro,
                    HORA_INICIO:hora_cadastro,
                    VENDEDOR: vendedor,
                    CONTATO:'',
                    OBSERVACOES:'',
                    OBSERVACOES2:'',
                    TIPO: 1,
                    NF_ENT_OS:'',
                    RECEPTOR:'',
                    VAL_PROD_MANIP: pedido.totalProdutos,
                    PERC_PROD_MANIP:0,
                    PERC_SERV_MANIP:100,
                    REVISAO_COMPLETA:'N',
                    DESTACAR:'N',
                    TABELA:'P',
                    QTDE_PARCELAS:qtdParcelas,
                    ALIQ_ISSQN:0,
                    OUTRAS_DESPESAS: pedido.outrasDespesas,
                    PESO_LIQUIDO:0,
                    BASE_ICMS_UF_DEST:0,
                    FORMA_PAGAMENTO:0,
        }

        return order;
    }


    proOrcaMapper(produto:any, codigoPedido:number, sequencia:number ){

        const prod:pro_orca ={
             ORCAMENTO:codigoPedido,
             SEQUENCIA:sequencia,
             PRODUTO: produto.codigo,
             GRADE:0,
             PADRONIZADO:0,
             COMPLEMENTO:'',
             UNIDADE:produto.unidade,
             ITEM_UNID: 1,
             JUST_IPI:'',
             JUST_ICMS:'',
             JUST_SUBST:'',
             QUANTIDADE: produto.quantidade,
             UNITARIO: produto.valor,
             TABELA: produto.valor,
             PRECO_TABELA:produto.valor,
             CUSTO_MEDIO:0,
             ULT_CUSTO:0,
             FRETE:0,
             IPI:0,
             DESCONTO:0
        }
        return prod;
    }
} 