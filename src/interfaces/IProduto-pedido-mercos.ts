        export interface IProdutoPedidoMercos   {
                         id: number,
                         produto_id: number,
                         tabela_preco_id: number,
                         quantidade: number,
                         quantidade_grades : [],
                         preco_tabela: number,
                         preco_liquido: number,
                         ipi: number,
                         tipo_ipi: number,
                         st: number,
                         subtotal: number,
                         cotacao_moeda: number,
                         excluido:  boolean,
                         descontos_do_vendedor : [ 
                            number
                        ] ,
                         descontos_de_promocoes : [
                            {
                                 regra_id : number,  desconto :number}

                         ],
                         descontos_de_politicas : [
                            {
                                 slug : string,
                                 regra_id : number,
                                 desconto : number
                            }
                        ],
                         observacoes:string,
                         produto_codigo:string,
                         produto_nome:string  ,
                         grupo_grades:string,
                         produto_agregador_id: string,
                         desconto_de_cupom:string

                        }