import ConfigApi from "../../Services/api";
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
					resolve(resultado)
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


		return new Promise ( async(resolve, reject)=>{
		for(const parcela of parcelas){
		let i =1;
			
			const sql =
			` INSERT INTO ${db_vendas}.par_orca (orcamento, parcela, valor, vencimento, tipo_receb) VALUES 
			('${codigoPedido}','${i}',${parcela.valor}, '${parcela.dataVencimento}', '1');
			`
			await conn.query(sql, (err,result)=>{
				if(err){
					//reject(err);
					console.log(err);
				}else{
					//console.log(result)
					resolve(result)
				}
			})

			if(i === parcelas.length){
				return;
			}
			i++;
	 }

		})
		
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
  produtos,
 parcelas
} = pedido;


	let totalProdutos = 0; // Inicializando a variável totalProdutos

			produtos.forEach((iten:any) => {
			  totalProdutos += (iten.valor * iten.quantidade) ; // - iten.desconto;
			});

			console.log(totalProdutos); // Exibindo o total dos produtos

let codigoPedido: any;
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
						let resultProdutos;
				try{
					resultProdutos =	await this.cadastraProdutosDoPedido(produtos,codigoPedido)

				}catch(err){console.log(err)}
				
				if(resultProdutos){
					try{
						await this.cadastraParcelasDoPedido(parcelas,codigoPedido)

					}catch(err){console.log("ocorreu um erro ao tentar gravar as parcelas")}
				
				}
				 
						
						}


		})
	})

}

}




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