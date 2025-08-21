 

 
 
       export interface IProdutoMercos{
            codigo:number
            nome:string
            preco_tabela:number
            preco_minimo:number  | null 
            comissao:number | null 
            ipi: number | null
            tipo_ipi:'P' | 'V' // "P" para percentual, "V" para valor fixo em Reais.
            st:number | null
            moeda: string // Moeda do produto: Real ("0"), Dólar ("1") ou Euro ("2").
            unidade:string 
            saldo_estoque:number
            excluido:boolean
            ativo:boolean
            categoria_id:number | null
            codigo_ncm:string
            peso_bruto:number
            largura:number
            altura:number
            comprimento:number
            peso_dimensoes_unitario:boolean
            }
                                                