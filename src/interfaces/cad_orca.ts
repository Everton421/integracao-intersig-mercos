import { pro_orca } from "./pro_orca"

export interface cad_orca{
    codigo_site:string,
    status:number,  
    cliente:number,
    total_produtos:number,
    desc_prod:number, 
    total_geral:number,
    data_pedido:any,
    valor_frete:number,
    situacao:string,
    data_cadastro:any,
    hora_cadastro:any,
    data_inicio:any,
    hora_inicio:any,
    vendedor:number,
    contato:string,
    observacoes:string,
    observacoes2:string,
    tipo:number,
    NF_ENT_OS:string,
    RECEPTOR:string,
    VAL_PROD_MANIP:any, 
    PERC_PROD_MANIP:any, 
    PERC_SERV_MANIP:any,
    REVISAO_COMPLETA:string,
    DESTACAR:string,
    TABELA:string,
    QTDE_PARCELAS:number,
    ALIQ_ISSQN:any,
    OUTRAS_DESPESAS:number,
    PESO_LIQUIDO:number,
    BASE_ICMS_UF_DEST:number,
    FORMA_PAGAMENTO:number
    produtos:pro_orca[]
}
/**
  status,  
  cod_site,
  cliente,
  total_produtos,
  desc_prod , 
  total_geral,
  data_pedido,
  valor_frete,
  situacao,
  data_cadastro,
  hora_cadastro,
  data_inicio,
  hora_inicio,
  vendedor,
  contato,
  observacoes,
  observacoes2,
  tipo,
  NF_ENT_OS,
  RECEPTOR,
  VAL_PROD_MANIP, 
  PERC_PROD_MANIP, 
  PERC_SERV_MANIP,
  REVISAO_COMPLETA,
  DESTACAR,
  TABELA,
  QTDE_PARCELAS,
  ALIQ_ISSQN,
  OUTRAS_DESPESAS,
  PESO_LIQUIDO,
  BASE_ICMS_UF_DEST,
  FORMA_PAGAMENTO
                            )


									 



 */