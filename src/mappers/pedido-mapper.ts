import { ProdutoApiRepository } from "../dataAcess/api-produto-repository/produto-api-repository";
import { FormaPagamentoRepository } from "../dataAcess/forma-pagamento-repository/forma-pagamento-repository";
import { ProdutoRepository } from "../dataAcess/produto-repository/produto-repository";
import { cad_orca } from "../interfaces/cad_orca";
import {  IPro_orca } from "../interfaces/IPro_orca";
import { IProdutoPedidoMercos } from "../interfaces/IProduto-pedido-mercos";
import { DateService } from "../Services/dateService/date-service";
import { loggerPedidos } from "../utils/logger-config";

export class PedidoMapper{
       private dateService = new DateService();
       private produtoRepository = new ProdutoRepository();
       private formaPagamentoRepository = new FormaPagamentoRepository();
      private produtoApiRepository = new ProdutoApiRepository();

    cadOrcaMapper( pedido:any, codigoCliente:number, vendedor:number,qtdParcelas:number ){
       
             const data_cadastro = this.dateService.obterDataAtual();
             const hora_cadastro = this.dateService.obterHoraAtual(); 

                
              let produtos:any[] = pedido.itens;

                let totalDescontosProdutos = 0;

                for( let i of  produtos){
                  let percentualDescVendedor = 0;
                  let percentualDescPoliticas = 0;
                  let percentualDescPromocoes = 0 ; 
                  let percentualTotalDescontos=0;

                         if(i.excluido === false ){
                            if ( i.descontos_do_vendedor.length > 0 ){
                                        for( let d = 0; d < i.descontos_do_vendedor.length ; d++  ){
                                               percentualDescVendedor +=  i.descontos_do_vendedor[d] / 100  
                                            }
                                  }
                              }

                             if( i.descontos_de_politicas.length > 0 ){
                                        for( let d = 0; d < i.descontos_de_politicas.length ; d++  ){
                                             percentualDescPoliticas +=  i.descontos_de_politicas[d].desconto / 100  
                                       }
                             }
                            if( i.descontos_de_promocoes.length > 0 ){
                                        for( let d = 0; d < i.percentualDescPromocoes.length ; d++  ){
                                             percentualDescPromocoes +=  i.percentualDescPromocoes[d].desconto / 100  
                                       }
                             }
                          percentualTotalDescontos = percentualDescPoliticas + percentualDescVendedor + percentualDescPromocoes;
                          totalDescontosProdutos = percentualTotalDescontos *  i.preco_tabela
                        }

                        let frete  = 0
                        if( pedido.valor_frete !== null ){
                           frete = pedido.valor_frete;
                        }

         const order:cad_orca = {
                     COD_SITE: pedido.id,
                    STATUS:0,
                    CLIENTE: codigoCliente,
                    TOTAL_PRODUTOS: pedido.total,
                    DESC_PROD: totalDescontosProdutos,
                    TOTAL_GERAL: pedido.total,
                    DATA_PEDIDO: this.dateService.formatarData(pedido.data_criacao) ,
                    VALOR_FRETE: frete,
                    SITUACAO: 'EA',
                    DATA_CADASTRO:data_cadastro,
                    HORA_CADASTRO:hora_cadastro,
                    DATA_INICIO:data_cadastro,
                    HORA_INICIO:hora_cadastro,
                    VENDEDOR: vendedor,
                    CONTATO:  'MERCOS - MOBILE' ,
                    OBSERVACOES:'',
                    OBSERVACOES2: pedido.observacoes,
                    TIPO: 1,
                    NF_ENT_OS:'',
                    RECEPTOR:'',
                    VAL_PROD_MANIP: pedido.total,
                    PERC_PROD_MANIP:100,
                    PERC_SERV_MANIP:100,
                    REVISAO_COMPLETA:'N',
                    DESTACAR:'N',
                    TABELA:'P',
                    QTDE_PARCELAS:qtdParcelas,
                    ALIQ_ISSQN:0,
                    OUTRAS_DESPESAS: 0,
                    PESO_LIQUIDO:0,
                    BASE_ICMS_UF_DEST:0,
                    FORMA_PAGAMENTO:0,
        }

        return order;
    }


    /**
     * 
     * @param filial filial onde será consultado o custo do produto
     * @param produto produto vindo do objeto do pedido do mercos
     * @param codigoPedido  codigo do pedido do sistema 
     * @param sequencia sequencia do item na tabela pro_orca
     * @returns 
     */
  async  proOrcaMapper( filial:any, produto: IProdutoPedidoMercos,codigoPedido:number, sequencia:number ){
            
        if(produto.excluido  ) return;

           let totalDescontosProdutos = 0;

                  let percentualDescVendedor = 0;
                  let percentualDescPoliticas = 0;
                  let percentualDescPromocoes = 0 ; 
                  let percentualTotalDescontos=0;

                         if(produto.excluido === false ){
                            if ( produto.descontos_do_vendedor.length > 0 ){
                                        for( let d = 0; d < produto.descontos_do_vendedor.length ; d++  ){
                                               percentualDescVendedor +=  produto.descontos_do_vendedor[d] / 100  
                                            }
                                  }
                              }

                             if(produto.descontos_de_politicas.length > 0 ){
                                        for( let d = 0; d < produto.descontos_de_politicas.length ; d++  ){
                                             percentualDescPoliticas +=  produto.descontos_de_politicas[d].desconto / 100  
                                       }
                             }
                            if( produto.descontos_de_promocoes.length > 0 ){
                                        for( let d = 0; d < produto.descontos_de_promocoes.length ; d++  ){
                                             percentualDescPromocoes +=  produto.descontos_de_promocoes[d].desconto / 100  
                                       }
                             }
                          percentualTotalDescontos = percentualDescPoliticas + percentualDescVendedor + percentualDescPromocoes;
                          totalDescontosProdutos = percentualTotalDescontos *  produto.preco_tabela

      let validProd = await this.produtoApiRepository.findByIdBling( String(produto.id))

      if( validProd.length === 0  ){
            console.log(`Nao foi encontrado vinculo do produto : `, produto.produto_nome,' codigo: ', produto.produto_codigo)
              loggerPedidos.error( `Nao foi encontrado vinculo do produto :  ${ produto.produto_nome}  codigo:    ${produto.produto_codigo}`)
        return
      } 

      let arrUnd = await this.produtoRepository.buscaUnidades(Number(produto.produto_codigo));
      let arrCust = await this.produtoRepository.buscaCustos( Number(produto.produto_codigo), filial);

      let custo_medio = 0;
      let ult_custo = 0;
      if(arrCust.length > 0 ){
          custo_medio = arrCust[0].CUSTO_MEDIO;
          ult_custo = arrCust[0].ULT_CUSTO;
      }

      let und = 'UND'
      if( arrUnd.length > 0 ){
        und = arrUnd[0].SIGLA;
      }

        const prod:IPro_orca ={
             ORCAMENTO:codigoPedido,
             SEQUENCIA:sequencia,
             PRODUTO: Number(produto.produto_codigo),
             GRADE:0,
             PADRONIZADO:0,
             COMPLEMENTO:'',
             UNIDADE:und,
             ITEM_UNID: 1,
             JUST_IPI:'',
             JUST_ICMS:'',
             JUST_SUBST:'',
             QUANTIDADE: produto.quantidade,
             UNITARIO: produto.preco_tabela,
             TABELA: 1,
             PRECO_TABELA:produto.preco_tabela,
             CUSTO_MEDIO:custo_medio,
             ULT_CUSTO:ult_custo,
             FRETE:0,
             IPI:0,
             DESCONTO:totalDescontosProdutos
        }
        return prod;
    }

     async parOrcaMapper(idPagamento: any, codigo_pedido: any, total_pedido: any) {

    const arrformaPagamento:any = await this.formaPagamentoRepository.findSyncedFpgtById(idPagamento);

    if (!arrformaPagamento || arrformaPagamento.length === 0) {
        console.error(`Forma de pagamento com ID ${idPagamento} não encontrada.`);
              loggerPedidos.error( ` Forma de pagamento com ID ${idPagamento} não encontrada. `)
        return [];
    }

    const {
        CODIGO,
        DIAS_ENTRADA,
        INTERVALO,
        NUM_PARCELAS
    } = arrformaPagamento[0];

    if (NUM_PARCELAS <= 0) {
        console.error(`Número de parcelas inválido (${NUM_PARCELAS}) para a forma de pagamento ${CODIGO}.`);
        return [];
    }
    
    const parcelas = [];
    const valorParcela = total_pedido / NUM_PARCELAS;

    const dataBase = new Date(this.dateService.obterDataAtual());

    let dataVencimento = new Date(dataBase);

    dataVencimento.setDate(dataVencimento.getDate() + DIAS_ENTRADA);

    for (let i = 1; i <= NUM_PARCELAS; i++) {
        
        if (i > 1) {
            dataVencimento.setDate(dataVencimento.getDate() + INTERVALO);
        }

        const ano = dataVencimento.getFullYear();
        const mes = String(dataVencimento.getMonth() + 1).padStart(2, '0');
        const dia = String(dataVencimento.getDate()).padStart(2, '0');
        const vencimentoFormatado = `${ano}-${mes}-${dia}`;

        parcelas.push({
            orcamento: codigo_pedido,
            parcela: i,
            valor: valorParcela,
            vencimento: vencimentoFormatado, // Usamos a data formatada corretamente
            tipo_receb: CODIGO,
            vlr_pago: 0,
            dt_pagamento: '0000-00-00 00:00:00'
        });
    }

    return parcelas;
}
} 