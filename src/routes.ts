import { Router,Request,Response, NextFunction } from "express";
  
import 'dotenv/config'; 
import { TokenController } from "./controllers/token/tokenController";
import { verificaToken } from "./Middlewares/TokenMiddleware";
import { ProdutoController } from "./controllers/produtos/ProdutoController";
import { ProdutoApi } from "./models/produtoApi/produtoApi";
import { ProdutoModelo } from "./models/produto/produtoModelo";
import { pedidoController } from "./controllers/pedido/pedidoController";
import { apiController } from "./controllers/apiController/apiController";
import { configApi } from "./models/configApi/config";
import { categoriaController } from "./controllers/categoria/categoriaController";
import { getProdutos } from "./controllers/get_vinculo_produtos/getProdutos";
const cron = require('node-cron')
const router = Router();


router.get('/', verificaToken,async (req,res) =>{
  res.render('index');
})

router.get('/config', async  ( req, res )=>{
  const configApi = new apiController();
  const objProdutos = new ProdutoModelo();
  const data = await configApi.buscaConfig();
  const tabelas = await objProdutos.buscaTabelaDePreco();
  res.render('config', {'config':data , 'tabelas':tabelas});
})

router.get('/produtos', verificaToken , async (req,res) =>{
   const objProdutos = new ProdutoModelo();
    const objSincronizados = new ProdutoApi();
    const sincronizados = await objSincronizados.buscaTodos();
  const produtos = await objProdutos.buscaProdutos();
  const tabelas = await objProdutos.buscaTabelaDePreco();
res.render('produtos',{'produtos' : produtos, 'sincronizados':sincronizados, 'tabelas': tabelas});
 })

 router.post('/api/produtos', verificaToken, new ProdutoController().enviaProduto)


  router.get('/callback', async (req, res, next) => {
   const apitokenController = new TokenController;
    const token = apitokenController.obterToken(req,res,next);
  });


router.get('/pedidos',verificaToken, new pedidoController().buscaPedidosBling) 
router.get('/estoque',verificaToken, new ProdutoController().enviaEstoque) 



router.post('/teste', async (req,res)=>{
  const au = JSON.stringify(req.body);
   //console.log(req.body)
  const obj = new configApi();
  let a = await obj.atualizaDados(req.body) 
  
})


router.get('/postEstoque', async (req,res)=>{
  const obj = new ProdutoController();
  await obj.enviaEstoque();  
})



router.get('/getProdutos',verificaToken,async( req,res)=>{
  const aux = new getProdutos();
   await aux.criarVinculo();
  })
  

     export {router} 
