import { conn, db_estoque, db_publico, db_vendas } from "../../database/databaseConfig" ;
import { ProdutoBling } from "../../interfaces/produtoBling";

export class ProdutoModelo{

    async buscaProdutos(conexao:any, publico:any){


      
        return new Promise( async (resolve, reject)=>{
            let sql = ` 
                            SELECT * FROM ${publico}.cad_prod WHERE NO_SITE = 'S';
                            `;
            await conexao.query(sql, (err:any,result:any)=>{
              if(err){
                reject(err);
              }else{
                resolve(result);
              }
            });
        });
  
     }

     async buscaProduto(conexao:any, publico:any,codigo:number){
      return new Promise( async (resolve, reject)=>{
          let sql = `SELECT * FROM ${publico}.cad_prod WHERE NO_SITE = 'S' AND CODIGO = ${codigo};`;

          await conexao.query(sql, async (err:any,result:any)=>{
            if(err){
              return reject(err);
            }else{
//              resolve(result);
               const saldo:any  = await this.buscaEstoqueReal(codigo);
              const estoque = { "estoque" : saldo[0].ESTOQUE  }
             result.push(estoque);
              resolve(result)
            }
          });
      });
 
   }

  async buscaEstoqueReal(codigo:number ){
    return new Promise( (resolve, reject)=>{
      
                          
    const sqlEstoque=` SELECT  
                          est.CODIGO,
                          IF(est.estoque < 0, 0, est.estoque) AS ESTOQUE
                        FROM 
                          (SELECT
                            P.CODIGO,
                            (SUM(PS.ESTOQUE) - 
                              (SELECT COALESCE(SUM((IF(PO.QTDE_SEPARADA > (PO.QUANTIDADE - PO.QTDE_MOV), PO.QTDE_SEPARADA, (PO.QUANTIDADE - PO.QTDE_MOV)) * PO.FATOR_QTDE) * IF(CO.TIPO = '5', -1, 1)), 0)
                                FROM ${db_vendas}.cad_orca AS CO
                                LEFT OUTER JOIN ${db_vendas}.pro_orca AS PO ON PO.ORCAMENTO = CO.CODIGO
                                WHERE CO.SITUACAO IN ('AI', 'AP', 'FP')
                                AND PO.PRODUTO = P.CODIGO)) AS estoque
                          FROM ${db_estoque}.prod_setor AS PS
                          LEFT JOIN  ${db_publico}.cad_prod AS P ON P.CODIGO = PS.PRODUTO
                          INNER JOIN ${db_publico}.cad_pgru AS G ON P.GRUPO = G.CODIGO
                          LEFT JOIN ${db_estoque}.setores AS S ON PS.SETOR = S.CODIGO
                          WHERE S.EST_ATUAL = 'X' AND P.CODIGO = ${codigo}
                          GROUP BY P.CODIGO) AS est;
                        `
    conn.query( sqlEstoque ,(err:any , result:any)=>{
      if(err){
        reject(err)
        console.log('erro ao obter o saldo de estoque')
      }else{
          resolve(result);
      }
    })
    })
  }


  async buscatabelaDePreco(codigo:number ){
    return new Promise( (resolve, reject)=>{
      
                          
    const sqlEstoque=` 
                        `
    conn.query( sqlEstoque ,(err:any , result:any)=>{
      if(err){
        reject(err)
        console.log('erro ao obter o tabela de preco')
      }else{
          resolve(result);
      }
    })
    })
  }



}
