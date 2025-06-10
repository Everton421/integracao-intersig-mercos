import {  ImgController } from "../controllers/imgBB/imgController";
import { CategoriaApiRepository } from "../dataAcess/api-categoria-repository/categoria-api-repository";
import { IProductSystem } from "../interfaces/IProduct";
import { ProdutoRepository } from "../dataAcess/produto-repository/produto-repository";
import { IProdutoBling  } from "./IProdutoBling";

    export type IProdutoBlingSemPreco = Omit<IProdutoBling, 'preco' >

export class ProdutoMapper{
  
      async  postProdutoMapper( produto:IProductSystem):Promise<IProdutoBlingSemPreco   >{
            return new Promise( async ( resolve, reject )=>{

    const produtoRepository = new ProdutoRepository();
    const categoriaRepository = new CategoriaApiRepository();
    const imgController    = new  ImgController();
       
      let preco:number ;

         const arrPreco = await produtoRepository.buscaPreco(produto.CODIGO, 1)
               preco = arrPreco[0].PRECO;
              const arrNcm  =  await produtoRepository.buscaNcm(produto.CODIGO);
              const ncm = arrNcm[0].NCM
              const cod_cest = arrNcm[0].COD_CEST
          const arrUnidades = await produtoRepository.buscaUnidades(produto.CODIGO);
             const unidade = arrUnidades[0].SIGLA  
          const arrCategoria = await categoriaRepository.buscaCategoriaApi(produto.GRUPO)  
           
          let  categoria = arrCategoria[0].Id_bling;
           
          //envio de imagen
               let links = await imgController.postFoto( produto ) ;
                //

             const post: IProdutoBlingSemPreco  = {
                                    codigo: produto.CODIGO,
                                    nome: produto.DESCRICAO,
                                    descricaoCurta: produto.DESCR_CURTA_SITE,
                                    descricaoComplementar: produto.DESCR_LONGA_SITE,
                                    tipo: 'P',
                                    unidade: unidade,
                                  //  preco: preco,
                                    pesoBruto: produto.PESO,
                                    formato: 'S',
                                    largura: produto.LARGURA,
                                    altura: produto.ALTURA,
                                    profundidade: produto.COMPRIMENTO,
                                    dimensoes: { altura: produto.ALTURA, largura: produto.LARGURA, profundidade: produto.COMPRIMENTO },
                                    tributacao: { cest: cod_cest, ncm: ncm, },
                                    categoria:{
                                        id:categoria
                                      }
                                };
                                resolve(post)
                              })
                     }


    

}