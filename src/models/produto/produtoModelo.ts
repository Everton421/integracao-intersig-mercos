import { conn, db_publico } from "../../database/databaseConfig" ;
import { ProdutoBling } from "../../interfaces/produtoBling";

export class ProdutoModelo{
    async buscaProduto(conexao:any, publico:any){
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


  //   async teste(){
  //      const data:any = await this.buscaProduto(conn,db_publico);
  //     // console.log(data);
  //     if(!data ){
  //      return;
  //     }
//
  //        const aux : ProdutoBling = {
  //                                    codigo:data.CODIGO,
  //                                    nome: data.DESCRICAO,
  //                                    descricaoCurta:data.DESCR_CURTA,
  //                                    descricaoComplementar:data.DESCR_LONGA,
  //                                    tipo:'P',
  //                                    unidade:'un',
  //                                    preco:1, // 
  //                                    pesoBruto:1,
  //                                    formato:'S',
  //                                    largura:data.LARGURA,
  //                                    altura:data.ALTURA,
  //                                    profundidade:data.COMPRIMENTO,
  //                                    dimensoes: { altura:data.ALTURA, largura:data.LARGURA, profundidade:data.COMPRIMENTO},
  //                                    tributacao: { cest:'', ncm:''  // }
  //                                  }
  //                          }
//
  // // console.log(aux)
  //                          return aux;
//
  //  }






}
