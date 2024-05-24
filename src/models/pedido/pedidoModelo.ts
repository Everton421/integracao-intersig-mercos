import { conn, conn_api, db_vendas } from "../../database/databaseConfig";
import { cad_orca } from "../../interfaces/cad_orca";
import { PedidoApi } from "../pedidoApi/pedidoApi";

export class pedidoErp{

 
	async cadastraProdutosDoPedido(produtos:any , codigoPedido:any ){
		return new Promise( async (resolve, reject )=>{


			let i=1;
			for(const prod of produtos){


				const codigoProduto = prod.codigo;

				let quantidadeProduto = prod.quantidade;
				let valor = prod.valor;
				let desconto = prod.desconto;
				let unidade = prod.unidade;

				 

			 const sql =
			`
			INSERT INTO ${db_vendas}.pro_orca (orcamento, sequencia, produto, grade, padronizado, complemento, unidade, item_unid, just_ipi, just_icms, just_subst, quantidade, unitario, tabela, preco_tabela, CUSTO_MEDIO, ULT_CUSTO, FRETE, ipi, desconto)
			VALUES (
				'${codigoPedido}',
				'${i}',
				'${codigoProduto}',
				'${0}',
				'${0}',
				'${''}',
				'${unidade}',   
				'${1}',
				'${''}',
				'${''}',
				'${''}',
				'${quantidadeProduto}',
				'${valor}',
				'${valor}',
				'${valor}',
				'${0}',
				'${0}',
				'${0}',
				'${0}',
				'${desconto}'
			);
			`;

			  await conn.query( sql, (error, resultado)=>{
				   if(error){
						   reject(" erro ao inserir produto do orcamento "+ error);
				   }else{
					   console.log(`produto  inserido com sucesso`);
				   }
				})

				if(i === produtos.length){
					return;
				}
				i++;

			}

			
		})
}

async cadastraParcelasDoPedido( parcelas:any , codigoPedido:any){

}

async cadastrarPedido( pedido:any ){

	const pedidoApi = new PedidoApi();

	const {
		codigo_site,
	status,
  cod_site,
  cliente,
  total_produtos,
  desc_prod,
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
  FORMA_PAGAMENTO,
  produtos
} = pedido;

	
		let codigoPedido:any;

	return new Promise( async (resolve, reject )=>{
			const sql = 
			` 
			INSERT INTO ${db_vendas}.cad_orca (status,  cliente, total_produtos, desc_prod ,total_geral, data_pedido, valor_frete, situacao, data_cadastro, hora_cadastro, data_inicio, hora_inicio, vendedor, contato, observacoes, observacoes2, tipo,  NF_ENT_OS, RECEPTOR, VAL_PROD_MANIP, PERC_PROD_MANIP, 
				PERC_SERV_MANIP, REVISAO_COMPLETA, DESTACAR, TABELA, QTDE_PARCELAS, ALIQ_ISSQN, 
				OUTRAS_DESPESAS, PESO_LIQUIDO, BASE_ICMS_UF_DEST, FORMA_PAGAMENTO)
				VALUES (
					'${status}',
					'${cliente}',
					'${total_produtos}',
					'${desc_prod}',
					'${total_geral}',
					'${data_pedido}',
					'${valor_frete}',
					'${situacao}',
					'${data_cadastro}',
					'${hora_cadastro}',
					'${data_inicio}',
					'${hora_inicio}',
					'${vendedor}',
					'${contato}',
					'${observacoes}',
					'${observacoes2}',
					'${tipo}',
					'${NF_ENT_OS}',
					'${RECEPTOR}',
					'${VAL_PROD_MANIP}',
					'${PERC_PROD_MANIP}',
					'${PERC_SERV_MANIP}',
					'${REVISAO_COMPLETA}',
					'${DESTACAR}',
					'${TABELA}',
					'${QTDE_PARCELAS}',
					'${ALIQ_ISSQN}',
					'${OUTRAS_DESPESAS}',
					'${PESO_LIQUIDO}',
					'${BASE_ICMS_UF_DEST}',
					'${FORMA_PAGAMENTO}'
						);     
			`
		await conn.query(sql, async (err, result)=>{
			if(err){
				reject(" erro ao cadastrar orcamento"+ err);

			}else{

				codigoPedido = result.insertId;
				console.log(codigoPedido);
					 resolve(result);

					 let json = { "Id_bling":codigo_site , "codigo_sistema":codigoPedido };
 
                         try{  
                              const result = await pedidoApi.cadastraPedidoApi(json)
                            }catch(err){
                                
                                console.log(" erro ao cadastrar na tabela da api"+ err);
                        
                            }



							await this.cadastraProdutosDoPedido(produtos,codigoPedido)
			}

		})
	})

}

}

/**
 INSERT INTO pro_orca (orcamento, sequencia, produto, 
	grade, padronizado, complemento,
	 unidade, item_unid, just_ipi,
	  just_icms, just_subst, quantidade, unitario, tabela, preco_tabela, CUSTO_MEDIO, ULT_CUSTO, FRETE, ipi, desconto)
														VALUES ('$codigoOrcamento',
														'$i',
														'$itens->produto_codigo',               
														'0',             
														'0',    
														'',           
														'$tp_unid',                        
														'1',
														'0',
														'0',
														'0',
														'$itens->quantidade',
														'$itens->preco_tabela',
														'$tabprecoVend ',
														'$valor_prod',
														'$custo_medio',
														'$ultimo_custo',
														'$pedidoFrete',
														'$ipi',
														'$descontoTotal')






 */



/*$sql = "INSERT INTO par_orca (orcamento, parcela, valor, vencimento, tipo_receb)
																VALUES ('$codigoOrcamento',
																'$parc', 
																'$valorParcela', 
																(SELECT ADDDATE(CURRENT_DATE(), INTERVAL $datapagto DAY) ),
																'$idPagamento'                    
																)";	
*/




/**
 
 $sql = "INSERT INTO cad_orca (status, cod_site, cliente, total_produtos, desc_prod ,total_geral, data_pedido, valor_frete, 
		situacao, data_cadastro, hora_cadastro, data_inicio, hora_inicio, vendedor,
		 contato, observacoes, observacoes2, tipo,  NF_ENT_OS, RECEPTOR, VAL_PROD_MANIP, PERC_PROD_MANIP, 
		PERC_SERV_MANIP, REVISAO_COMPLETA, DESTACAR, TABELA, QTDE_PARCELAS, ALIQ_ISSQN, OUTRAS_DESPESAS, 
		PESO_LIQUIDO, BASE_ICMS_UF_DEST, FORMA_PAGAMENTO)
									VALUES ('$statusSistema',
											'$codigoSite',
											'$codigoCliente', 			  	          
											upper('$pedidoTotalProd'),
											'$desc_prod',
											upper('$pedidoTotal'),                
											now(),
											'$pedidoFrete',
											'EA',
											now(),
											now(),
											now(),
											now(),
											'$codigoVendBd',
											'$descTipo',
											'',
											'$obs',
											'$tipoVenda',
											'',
											'',
											'$pedidoTotalProd',
											'100',
											'100',
											'N',
											'N',
											'P',
											'$parcelas',
											'0.00',
											'0',
											'0',
											'0.00',
											'$idPagamento'
											)";            
 
 
 
 
 
 
 */