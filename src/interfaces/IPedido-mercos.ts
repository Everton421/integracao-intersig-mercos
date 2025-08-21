interface DescontoDePolitica {
  slug: string;
  regra_id: number;
  desconto: number;
}

interface ItemPedido {
  id: number;
  produto_id: number;
  tabela_preco_id: number;
  quantidade: number;
  quantidade_grades: any[]; // TODO: Definir tipo correto se souber a estrutura
  preco_tabela: number;
  preco_liquido: number;
  ipi: number;
  tipo_ipi: string;
  st: number;
  subtotal: number;
  cotacao_moeda: number;
  excluido: boolean;
  descontos_do_vendedor: any[]; // TODO: Definir tipo correto se souber a estrutura
  descontos_de_promocoes: any[]; // TODO: Definir tipo correto se souber a estrutura
  descontos_de_politicas: DescontoDePolitica[];
  observacoes: string;
  produto_codigo: string;
  produto_nome: string;
  grupo_grades: any; // TODO: Definir tipo correto se souber a estrutura
  produto_agregador_id: any; // Pode ser number ou null. Usar 'any' se não tiver certeza
  desconto_de_cupom: any; // Pode ser number ou null. Usar 'any' se não tiver certeza
}

interface EnderecoEntrega {
  id: number | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
}

interface ComissaoVendedor {
  vendedor_id: number;
  percentual: number;
}

export interface PedidoMercos {
  id: number;
  pedido_origem_id: number | null;
  cliente_id: number;
  transportadora_id: number | null;
  transportadora_nome: string;
  tipo_pedido_id: number | null;
  criador_id: number;
  nome_contato: string;
  status: string; // Usar string conforme a documentação
  numero: number;
  rastreamento: string;
  valor_frete: number | null;
  total: number;
  condicao_pagamento: string;
  condicao_pagamento_id: number;
  forma_pagamento_id: number;
  data_emissao: string; // Usar string para datas ISO 8601
  observacoes: string;
  itens: ItemPedido[];
  extras: any[]; // TODO: Defina um tipo mais específico se souber a estrutura
  ultima_alteracao: string; // Usar string para datas ISO 8601
  cliente_razao_social: string;
  cliente_nome_fantasia: string;
  cliente_cnpj: string;
  cliente_inscricao_estadual: string;
  cliente_rua: string;
  cliente_numero: string;
  cliente_complemento: string;
  cliente_cep: string;
  cliente_bairro: string;
  cliente_cidade: string;
  cliente_estado: string;
  cliente_suframa: string;
  contato_nome: string;
  representada_id: number;
  representada_nome_fantasia: string;
  representada_razao_social: string;
  status_faturamento: string; // Usar string conforme a documentação
  status_custom_id: number | null;
  status_b2b: number | null;
  endereco_entrega: EnderecoEntrega;
  data_criacao: string; // Usar string para datas ISO 8601
  cliente_telefone: string[];
  cliente_email: string[];
  cupom_de_desconto: string | null;
  percentual_total_comissao_pedido: number;
  comissoes_vendedores: ComissaoVendedor[];
  prazo_entrega?: string;
  modalidade_entrega_nome?: string;
  possui_informacao_pagamento?: boolean;
}