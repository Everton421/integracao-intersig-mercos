import { response } from "express";
import { ProdutoModelo } from "../../models/produto/produtoModelo";
import { conn,db_publico } from "../../database/databaseConfig";
import { ProdutoBling } from "../../interfaces/produtoBling";
import { api } from "../../Services/api";

export class ProdutoController {
    async enviaProduto() {
        const produto = new ProdutoModelo();
        const produtos:any = await produto.buscaProduto(conn,db_publico);

        produtos.forEach( async (data:any) => {

            const aux : ProdutoBling = {
                codigo:data.CODIGO,
                nome: data.DESCRICAO,
                descricaoCurta:data.DESCR_CURTA,
                descricaoComplementar:data.DESCR_LONGA,
                tipo:'P',
                unidade:'un',
                preco:1, // 
                pesoBruto:1,
                formato:'S',
                largura:data.LARGURA,
                altura:data.ALTURA,
                profundidade:data.COMPRIMENTO,
                dimensoes: { altura:data.ALTURA, largura:data.LARGURA, profundidade:data.COMPRIMENTO},
                tributacao: { cest:'', ncm:''  }
      }
               try {
            const response = await api.post('/produtos', aux);
              console.log(response.data);
          } catch (error:any) {
            if (error.response) {
                // A requisição foi feita e o servidor retornou um código de status diferente de 2xx
                console.log('Status:', error.response.status);
                console.log('Data:', error.response.data.error.fields);
            }
        }



        });

//        try {
//            const data = await produto.teste();
//            const response = await api.post('/produtos', data);
//
//            console.log(response.data);
//        } catch (error) {
//            if (error.response) {
//                // A requisição foi feita e o servidor retornou um código de status diferente de 2xx
//                console.log('Status:', error.response.status);
//                console.log('Data:', error.response.data.error.fields);
//            }
//        }
//


    }
}