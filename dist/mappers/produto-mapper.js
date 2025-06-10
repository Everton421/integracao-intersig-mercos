"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoMapper = void 0;
const imgController_1 = require("../controllers/imgBB/imgController");
const categoria_api_repository_1 = require("../dataAcess/api-categoria-repository/categoria-api-repository");
const produto_repository_1 = require("../dataAcess/produto-repository/produto-repository");
class ProdutoMapper {
    async postProdutoMapper(produto) {
        return new Promise(async (resolve, reject) => {
            const produtoRepository = new produto_repository_1.ProdutoRepository();
            const categoriaRepository = new categoria_api_repository_1.CategoriaApiRepository();
            const imgController = new imgController_1.ImgController();
            let preco;
            const arrPreco = await produtoRepository.buscaPreco(produto.CODIGO, 1);
            preco = arrPreco[0].PRECO;
            const arrNcm = await produtoRepository.buscaNcm(produto.CODIGO);
            const ncm = arrNcm[0].NCM;
            const cod_cest = arrNcm[0].COD_CEST;
            const arrUnidades = await produtoRepository.buscaUnidades(produto.CODIGO);
            const unidade = arrUnidades[0].SIGLA;
            const arrCategoria = await categoriaRepository.buscaCategoriaApi(produto.GRUPO);
            let categoria = arrCategoria[0].Id_bling;
            //envio de imagen
            let links = await imgController.postFoto(produto);
            //
            const post = {
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
                categoria: {
                    id: categoria
                }
            };
            resolve(post);
        });
    }
}
exports.ProdutoMapper = ProdutoMapper;
