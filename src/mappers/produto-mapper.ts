import {  ImgController } from "../controllers/imgBB/imgController";
import { CategoriaApiRepository } from "../dataAcess/api-categoria-repository/categoria-api-repository";
import { IProductSystem } from "../interfaces/IProduct";
import { ProdutoRepository } from "../dataAcess/produto-repository/produto-repository";
import {  IProdutoMercos } from "../interfaces/IProduto-mercos";
import { IpiRepository } from "../dataAcess/ipi-repository/ipi-repository";

    export type IProdutoSemPreco = Omit<IProdutoMercos, 'preco' >

export class ProdutoMapper{
  
      async  postProdutoMapper( produto:IProductSystem):Promise< { post?:IProdutoSemPreco , dataEstoque?:string, dataPreco?:string,erro:boolean, msg:string  }       >{
            return new Promise( async ( resolve, reject )=>{

    const produtoRepository = new ProdutoRepository();
    const categoriaRepository = new CategoriaApiRepository();
    const ipiRepository = new IpiRepository();
       
      let preco:number ;

          const arrPreco = await produtoRepository.buscaPrecoPadrao(produto.CODIGO )
                preco = arrPreco[0].PRECO;
              
              const arrNcm  =  await produtoRepository.buscaNcm(produto.CODIGO);
              let ncm = arrNcm[0].NCM
              const cod_cest = arrNcm[0].COD_CEST
              ncm = ncm + '-'+produto.CODIGO;

             const arrUnidades = await produtoRepository.buscaUnidades(produto.CODIGO);
             const unidade = arrUnidades[0].SIGLA  
        
             const arrIpi = await ipiRepository.findByProduct(produto.CODIGO);
             const ipi = arrIpi[0].IPI; 
       
        const arrCategoria = await categoriaRepository.buscaCategoriaApi(produto.GRUPO)  
          let  categoria = null;
          
          if( arrCategoria.length  > 0  ){
               categoria = arrCategoria[0].Id;
          }else{
            console.log(` A categoria do produto ${produto.CODIGO} nao foi encontrada` )
            resolve({ erro:true, msg: ` A categoria do produto ${produto.CODIGO} nao foi encontrada`})
          }

        const arrEstoque = await produtoRepository.buscaEstoqueReal( produto.CODIGO )              
              const estoque = arrEstoque[0].ESTOQUE;

              const dataEstoque = arrEstoque[0].DATA_RECAD;
              const dataPreco = arrPreco[0].DATA_RECAD;

              let ativo = false;
              if( produto.ATIVO === 'S') ativo = true; 

             const post: IProdutoMercos  = {
                                    codigo: produto.CODIGO,
                                    nome: produto.DESCRICAO,
                                    preco_tabela:preco,
                                    preco_minimo: null,
                                    comissao:null,
                                     ipi:ipi,
                                    tipo_ipi: "P",
                                    st:null,
                                    moeda: '0',
                                    unidade:unidade,
                                    saldo_estoque: estoque,
                                    excluido: false,
                                    ativo: ativo,
                                    categoria_id: categoria,
                                    codigo_ncm:ncm,
                                     peso_bruto:produto.PESO,
                                     largura: produto.LARGURA,
                                     altura: produto.ALTURA,
                                    comprimento:produto.COMPRIMENTO,
                                    peso_dimensoes_unitario:true  
                                  };
                                resolve( { post, dataEstoque, dataPreco , erro:false, msg:''}   )
                              })
                     }



}