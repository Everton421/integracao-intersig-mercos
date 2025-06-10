"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
require("dotenv/config");
const token_controller_1 = require("./controllers/token-controller/token-controller");
const TokenMiddleware_1 = require("./Middlewares/TokenMiddleware");
const produtos_controller_1 = require("./controllers/produtos-controller/produtos-controller");
const produto_api_repository_1 = require("./dataAcess/api-produto-repository/produto-api-repository");
const produto_repository_1 = require("./dataAcess/produto-repository/produto-repository");
const api_config_controller_1 = require("./controllers/api-config-controller/api-config-controller");
const api_config_repository_1 = require("./dataAcess/api-config-repository/api-config-repository");
const sync_stock_1 = require("./Services/sync-stock/sync-stock");
const pedido_api_repository_1 = require("./dataAcess/api-pedido-repository/pedido-api-repository");
const categoria_repository_1 = require("./dataAcess/categoria-repository/categoria-repository");
const categoria_controller_1 = require("./controllers/categoria-controller/categoria-controller");
const cliente_api_repositoryi_1 = require("./dataAcess/api-cliente-repository/cliente-api-repositoryi");
const router = (0, express_1.Router)();
exports.router = router;
const produtoRepository = new produto_repository_1.ProdutoRepository();
const configApi = new api_config_controller_1.apiController();
const produtoApiRepository = new produto_api_repository_1.ProdutoApiRepository();
const categoryRepository = new categoria_repository_1.CategoriaRepository();
const apiConfigRepository = new api_config_repository_1.ApiConfigRepository();
const syncEstock = new sync_stock_1.SyncStock();
const pedidoApiRepository = new pedido_api_repository_1.PedidoApiRepository();
const clienteApiRepository = new cliente_api_repositoryi_1.ClienteApiRepository();
router.get('/', TokenMiddleware_1.verificaToken, async (req, res) => {
    res.render('index');
});
router.get('/config', async (req, res) => {
    const data = await configApi.buscaConfig();
    const tabelas = await produtoRepository.buscaTabelaDePreco();
    res.render('config', { 'config': data, 'tabelas': tabelas });
});
router.get('/produtos', TokenMiddleware_1.verificaToken, async (req, res) => {
    const produtos = await produtoApiRepository.buscaTodos();
    const tabelas = await produtoRepository.buscaTabelaDePreco();
    res.render('produtos', { 'produtos': produtos, 'tabelas': tabelas });
});
router.get('/categorias', TokenMiddleware_1.verificaToken, async (req, res) => {
    const data = await categoryRepository.buscaGrupoIndex();
    res.render('categorias', { 'categorias': data });
});
router.get('/clientes', TokenMiddleware_1.verificaToken, async (req, res) => {
    const data = await clienteApiRepository.getClientIntegracao();
    console.log(data);
    res.render('clientes', { 'clientes': data });
});
router.get('/configuracoes', async (req, res) => {
    let dadosConfig = await apiConfigRepository.buscaConfig();
    let objProdutos = new produto_repository_1.ProdutoRepository();
    let tabelasDePreco = await objProdutos.buscaTabelaDePreco();
    res.render('configuracoes', { dados: dadosConfig[0], tabelas: tabelasDePreco });
});
router.post('/api/produtos', TokenMiddleware_1.verificaToken, async (req, res) => {
    const obj = new produtos_controller_1.ProdutoController();
    let dadosConfig = await apiConfigRepository.buscaConfig();
    if (dadosConfig[0].enviar_produtos === 'E') {
        await obj.enviaProduto(req, res);
    }
    if (dadosConfig[0].enviar_produtos === 'S') {
        await obj.geraVinculo(req, res);
    }
});
router.post('/api/categorias', new categoria_controller_1.CategoriaController().postCategory);
router.get('/callback', async (req, res, next) => {
    const apitokenController = new token_controller_1.TokenController;
    const token = apitokenController.obterToken(req, res, next);
});
router.get('/pedidos', async (req, res) => {
    let dados = await pedidoApiRepository.findAll();
    res.render('pedidos', { pedidos: dados });
});
router.get('/estoque', TokenMiddleware_1.verificaToken, async () => {
    let dadosConfig = await apiConfigRepository.buscaConfig();
    if (dadosConfig[0].enviar_estoque > 0) {
        await syncEstock.enviaEstoque();
    }
});
router.post('/ajusteConfig', TokenMiddleware_1.verificaToken, new api_config_controller_1.apiController().ajusteConfig);
