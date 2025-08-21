import { conn, db_vendas } from "../../database/databaseConfig";
import { PedidoMapper } from "../../mappers/pedido-mapper";
import { PedidoApiRepository } from "../api-pedido-repository/pedido-api-repository";
import { cad_orca } from "../../interfaces/cad_orca";
import { configDotenv } from "dotenv";
import { loggerPedidos } from "../../utils/logger-config";
 
 type OkPacket = {
  fieldCount: number,
  affectedRows: number,
  insertId: number,
  serverStatus: number,
  warningCount: number,
  message: string,
  protocol41: boolean,
  changedRows: number
}

export class PedidoRepository{

	 		
	private mapper = new PedidoMapper();
	private pedidoApiRepository = new PedidoApiRepository();

	 /**
	  * 
	  * @param filial filial onde esta os custos do produto  
	  * @param produtos 
	  * @param codigoPedido 
	  * @returns 
	  */
	async cadastraProdutosDoPedido(   produtos:any[]  , codigoPedido:any ){
		return new Promise( async (resolve, reject )=>{
			let i=1;
			for(const prod of produtos){
			//		const prodMapper = await this.mapper.proOrcaMapper( filial, prod,codigoPedido , i );
			 const sql = 
			 ` INSERT INTO ${db_vendas}.pro_orca  SET
				ORCAMENTO = '${codigoPedido}',
				SEQUENCIA = '${ i}',
				PRODUTO = '${prod.PRODUTO}',
				GRADE = '${prod.GRADE}',
				PADRONIZADO ='${prod.PADRONIZADO}',
				COMPLEMENTO = '${prod.COMPLEMENTO}',
				UNIDADE = '${prod.UNIDADE}',   
				ITEM_UNID = '${prod.ITEM_UNID}',
				JUST_IPI = '${prod.JUST_IPI}',
				JUST_ICMS = '${prod.JUST_ICMS}',
				JUST_SUBST = '${prod.JUST_SUBST}',
				QUANTIDADE = '${prod.QUANTIDADE}',
				UNITARIO ='${prod.UNITARIO}',
				TABELA = '${prod.UNITARIO}',
				PRECO_TABELA = '${prod.UNITARIO}',
				CUSTO_MEDIO = '${prod.CUSTO_MEDIO}',
				ULT_CUSTO = '${prod.ULT_CUSTO}',
				FRETE = '${prod.FRETE}',
				IPI = '${prod.IPI}',
				DESCONTO = '${prod.DESCONTO}'
			`;

			  await conn.query( sql, (error, resultado)=>{
				   if(error){
                             loggerPedidos.error( `  erro ao inserir produto do orcamento  ${ codigoPedido } `)
						   reject(" erro ao inserir produto do orcamento "+ error);
				   }else{
					resolve(resultado)
				   }
				})

			 	if(i === produtos.length){
			 		return;
			 	}
			 	i++;

			}

			
		})
}

/**
 * 
 * @param parcelas array com as parcelas a serem processadas
 * @param codigoPedido codigo do pedido 
 * @returns 
 */

async cadastraParcelasDoPedido( parcelas: any[] , codigoPedido:any){
		return new Promise ( async(resolve, reject)=>{
		for(const parcela of parcelas){
			let i =1;
			const sql =
			` INSERT INTO ${db_vendas}.par_orca (orcamento, parcela, valor, vencimento, tipo_receb) VALUES 
			('${codigoPedido}','${parcela.parcela}',${parcela.valor}, '${parcela.vencimento}', '${parcela.tipo_receb}');
			`
			await conn.query(sql, (err,result)=>{
				if(err){
					console.log( ' erro ao tentar cadastrar parcelas do pedido ',err  );
                             loggerPedidos.error( `  erro ao inserir parcelas do orcamento  ${ codigoPedido } ` )
			 			reject(err);
				}else{
				//	console.log(" parcela registrada com sucesso:"+ parcela.parcela)
					resolve(result)
				}
			})
			 }
		})
		
}
async cadastraParcelaDoPedido( parcela: any  , codigoPedido:any):Promise<OkPacket>{
		return new Promise ( async(resolve, reject)=>{
			const sql =
			` INSERT INTO ${db_vendas}.par_orca (orcamento, parcela, valor, vencimento, tipo_receb) VALUES 
			('${codigoPedido}','${parcela.parcela}',${parcela.valor}, '${parcela.vencimento}', '${parcela.tipo_receb}');
			`
			await conn.query(sql, (err,result)=>{
				if(err){
					console.log( ' erro ao tentar cadastrar parcelas do pedido ',err  );
                             loggerPedidos.error( `  erro ao tentar cadastrar parcelas do pedido  ${ codigoPedido } ` )

			 			reject(err);
				}else{
					console.log(" parcela registrada com sucesso:"+ parcela.parcela)
					resolve(result)
				}
	 			})

		})
		
}
/**
 * 
 * @param pedido objeto contendo os dados necessarios para registrar na tabela cad_orca ( é necessario tratar os dados com o mapper service)
 * @returns 
 */
 
async cadastrarPedido(   pedido: cad_orca  ):Promise<OkPacket>{
 
	return new Promise( async (resolve, reject )=>{
			const sql = 
			` 
			INSERT INTO ${db_vendas}.cad_orca (status,  cliente, total_produtos, desc_prod ,total_geral, data_pedido, valor_frete, situacao, data_cadastro, hora_cadastro, data_inicio, hora_inicio, vendedor, contato, observacoes, observacoes2, tipo,  NF_ENT_OS, RECEPTOR, VAL_PROD_MANIP, PERC_PROD_MANIP, 
				PERC_SERV_MANIP, REVISAO_COMPLETA, DESTACAR, TABELA, QTDE_PARCELAS, ALIQ_ISSQN, 
				OUTRAS_DESPESAS, PESO_LIQUIDO, BASE_ICMS_UF_DEST, FORMA_PAGAMENTO)
				VALUES (
					'${pedido.STATUS}',
					'${pedido.CLIENTE}',
					'${pedido.TOTAL_PRODUTOS}',
					'${pedido.DESC_PROD}',
					'${pedido.TOTAL_GERAL}',
					'${pedido.DATA_PEDIDO}',
					'${pedido.VALOR_FRETE}',
					'${pedido.SITUACAO}',
					'${pedido.DATA_CADASTRO}',
					'${pedido.HORA_CADASTRO}',
					'${pedido.DATA_INICIO}',
					'${pedido.HORA_INICIO}',
					'${pedido.VENDEDOR}',
					'${pedido.CONTATO}',
					'${pedido.OBSERVACOES}',
					'${pedido.OBSERVACOES2}',
					'${pedido.TIPO}',
					'${pedido.NF_ENT_OS}',
					'${pedido.RECEPTOR}',
					'${pedido.VAL_PROD_MANIP}',
					'${pedido.PERC_PROD_MANIP}',
					'${pedido.PERC_SERV_MANIP}',
					'${pedido.REVISAO_COMPLETA}',
					'${pedido.DESTACAR}',
					'${pedido.TABELA}',
					'${pedido.QTDE_PARCELAS}',
					'${pedido.ALIQ_ISSQN}',
					'${pedido.OUTRAS_DESPESAS}',
					'${pedido.PESO_LIQUIDO}',
					'${pedido.BASE_ICMS_UF_DEST}',
					'${pedido.FORMA_PAGAMENTO}'
						);     
			`
		 
		await conn.query(sql, async (err, result)=>{
			if(err){
				reject(" erro ao cadastrar orcamento"+ err);
                             loggerPedidos.error( `  erro ao tentar inserir os dados do pedido na tabela cad_orca  ` )

			}else{
				resolve( result);
				 }
		})
		 
	})

}

/**
 * 
 * @param pedido 
 * @param codigoPedido codigo do pedido a ser atualizado
 * @returns 
 */
async updatePedido( pedido:cad_orca, codigoPedido:number ):Promise<OkPacket>{
	return new Promise( async ( resolve, reject ) =>{

			let sql  = ` UPDATE ${db_vendas}.cad_orca set ` 
			let conditions = [];
			let values = []

		if(pedido.STATUS){
			conditions.push(' STATUS = ? ');
			values.push(pedido.STATUS);
		}
		if(pedido.CLIENTE){
			conditions.push( ' CLIENTE = ? ');
			values.push(pedido.CLIENTE);
		}
		if(pedido.TOTAL_PRODUTOS){
			conditions.push(' TOTAL_PRODUTOS = ? ' );
			values.push(pedido.TOTAL_PRODUTOS);
		}
		if(pedido.DESC_PROD){
			conditions.push(' DESC_PROD = ? ');
			values.push(pedido.DESC_PROD);
		}
		if(pedido.TOTAL_GERAL){
			conditions.push( ' TOTAL_GERAL = ? ');
			values.push(pedido.TOTAL_GERAL);
		}
		if(pedido.DATA_PEDIDO){
			conditions.push( ' DATA_PEDIDO = ? ');
			values.push(pedido.DATA_PEDIDO);
		}
		if(pedido.VALOR_FRETE){
			conditions.push(' VALOR_FRETE = ? ');
			values.push(pedido.VALOR_FRETE);
		}
		if(pedido.SITUACAO){
			conditions.push( ' SITUACAO = ? ') ;
			values.push(pedido.SITUACAO);
		}
		if(pedido.DATA_CADASTRO){
			conditions.push( ' DATA_CADASTRO = ? ');
			values.push(pedido.DATA_CADASTRO);
		}
		if(pedido.HORA_CADASTRO){
			conditions.push( ' HORA_CADASTRO = ? ');
			values.push(pedido.HORA_CADASTRO);
		}
		if(pedido.DATA_INICIO){
			conditions.push( ' DATA_INICIO = ? ');
			values.push(pedido.DATA_INICIO);
		}
		if(pedido.HORA_INICIO){
			conditions.push( ' HORA_INICIO = ? ');
			values.push(pedido.HORA_INICIO);
		}
		if(pedido.VENDEDOR){
			conditions.push( ' VENDEDOR = ? ');
			values.push(pedido.VENDEDOR);
		}
		if(pedido.CONTATO){
			conditions.push( ' CONTATO = ? ');
			values.push(pedido.CONTATO);
		}
		if(pedido.OBSERVACOES){
			conditions.push( ' OBSERVACOES = ? ');
			values.push(pedido.OBSERVACOES);
		}
		if(pedido.OBSERVACOES2){
			conditions.push( ' OBSERVACOES2 = ? ');
			values.push(pedido.OBSERVACOES2);
		}
		if(pedido.TIPO){
			conditions.push( ' TIPO = ? ' );
			values.push(pedido.TIPO);
		}
		if(pedido.NF_ENT_OS){
			conditions.push( ' NF_ENT_OS = ? ');
			values.push(pedido.NF_ENT_OS);
		}
		if(pedido.RECEPTOR){
			conditions.push( ' RECEPTOR = ? ');
			values.push(pedido.RECEPTOR);
		}
		if(pedido.VAL_PROD_MANIP){
			conditions.push( ' VAL_PROD_MANIP = ? ');
			values.push(pedido.VAL_PROD_MANIP);
		}
		if(pedido.PERC_PROD_MANIP){
			conditions.push(' PERC_PROD_MANIP = ? ' );
			values.push(pedido.PERC_PROD_MANIP);
		}
		if(pedido.PERC_SERV_MANIP){
			conditions.push(' PERC_SERV_MANIP = ? ');
			values.push(pedido.PERC_SERV_MANIP);
		}
		if(pedido.REVISAO_COMPLETA){
			conditions.push(' REVISAO_COMPLETA = ? ');
			values.push(pedido.REVISAO_COMPLETA);
		}
		if(pedido.DESTACAR){
			conditions.push( ' DESTACAR = ? ');
			values.push(pedido.DESTACAR);
		}
		if(pedido.TABELA){
			conditions.push( ' TABELA = ? ');
			values.push(pedido.TABELA);
		}
		if(pedido.QTDE_PARCELAS){
			conditions.push(' QTDE_PARCELAS = ? ');
			values.push(pedido.QTDE_PARCELAS);
		}
		if(pedido.ALIQ_ISSQN){
			conditions.push( ' ALIQ_ISSQN = ? ');
			values.push(pedido.ALIQ_ISSQN);
		}
		if(pedido.OUTRAS_DESPESAS){
			conditions.push( ' OUTRAS_DESPESAS = ? ');
			values.push(pedido.OUTRAS_DESPESAS);
		}
		if(pedido.PESO_LIQUIDO){
			conditions.push( ' PESO_LIQUIDO = ? ');
			values.push(pedido.PESO_LIQUIDO);
		}
		if(pedido.BASE_ICMS_UF_DEST){
			conditions.push( ' BASE_ICMS_UF_DEST = ? ');
			values.push(pedido.BASE_ICMS_UF_DEST);
		}
		if(pedido.FORMA_PAGAMENTO){
			conditions.push(' FORMA_PAGAMENTO = ? ');
			values.push(pedido.FORMA_PAGAMENTO);
		}
				
		let finalSql = sql;
		let whereClause = ' WHERE CODIGO =  ? '
			values.push(codigoPedido);
				if( conditions.length > 0 ){
						finalSql = sql + conditions.join(' , ') + whereClause;
				}
				await conn.query( finalSql, values , (err ,result )=>{
					if ( err){
						console.log(` Erro ao tentar atualizar o pedido codigo: ${codigoPedido}   sql:${finalSql} values: ${values}`,)
                             loggerPedidos.error( `  Erro ao tentar atualizar o pedido codigo: ${codigoPedido}` )
						reject(err)
					}else{
						resolve(result);
					}
				})
		})

}	

/**
 * 
 * @param codigoPedido codigo do pedido que será excluido os itens 
 * @returns 
 */
async deleteProdutos(codigoPedido:number){
	return new Promise( async (resolve, reject )=>{

			let sql = ` DELETE   FROM ${db_vendas}.pro_orca where ORCAMENTO = ?   ` 
		await conn.query( sql, codigoPedido, ( err, result )=>{
			if( err){
				console.log( `Erro ao tentar excluir os itens do pedido: ${codigoPedido} `,err  )
                             loggerPedidos.error( `  Erro ao tentar excluir os itens do pedido: ${codigoPedido}` )
				reject(err)
			}else{
				resolve(result)
			}
		})

		})
}

/**
 * 
  * @param codigoPedido codigo do pedido que será excluido os itens 
 * @returns 
 */
async deleteParcelas(codigoPedido:number){
	return new Promise( async (resolve, reject )=>{

			let sql = ` DELETE   FROM ${db_vendas}.par_orca where ORCAMENTO = ?   ` 
		await conn.query( sql, codigoPedido, ( err, result )=>{
			if( err){
				console.log( `Erro ao tentar excluir as parcelas do pedido: ${codigoPedido} `,err  )
                             loggerPedidos.error( `  Erro ao tentar excluir as parcelas do pedido: ${codigoPedido}` )
				reject(err)
			}else{
				console.log("parcelas deletada")
				resolve(result)
			}
		})

		})
}

/**
 * obtem todas as informações do pedido contidas na tabela cad_orca 
 * @param codigo codigo do pedido 
 * @returns 
 */
async findByCode( codigo:number ):Promise<cad_orca[]>{
	return new Promise(( resolve, reject ) =>{
		const sql = `SELECT * FROM ${db_vendas}.cad_orca WHERE CODIGO = ${codigo}`;

		conn.query(sql, ( err, result )=>{

				if(err){
					console.log("Erro ao consultar a tabela cad_orca ", err);
                             loggerPedidos.error(  "Erro ao consultar a tabela cad_orca ")
					reject(err)
				}else{
					resolve(result)
				}
			})	


	})
}

}
