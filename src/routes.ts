import { Router,Request,Response, NextFunction } from "express";
  
import 'dotenv/config'; 
import { TokenController } from "./controllers/token-controller/token-controller";
import { verificaToken } from "./Middlewares/TokenMiddleware";
import { ProdutoController } from "./controllers/produtos-controller/produtos-controller";
import { ProdutoApiRepository } from "./dataAcess/api-produto-repository/produto-api-repository";
import { ProdutoRepository } from "./dataAcess/produto-repository/produto-repository";
import { apiController } from "./controllers/api-config-controller/api-config-controller";
import {  ApiConfigRepository } from "./dataAcess/api-config-repository/api-config-repository";
import { CategoriaApiRepository } from "./dataAcess/api-categoria-repository/categoria-api-repository";
import { SyncStock } from "./Services/sync-stock/sync-stock";
import { PedidoRepository } from "./dataAcess/pedido-repository/pedido-repository";
import { PedidoApiRepository } from "./dataAcess/api-pedido-repository/pedido-api-repository";
import { SyncORders } from "./Services/sync-orders/sync-orders";
import { CategoriaRepository } from "./dataAcess/categoria-repository/categoria-repository";
import { CategoriaController } from "./controllers/categoria-controller/categoria-controller";
import { ClienteApiRepository } from "./dataAcess/api-cliente-repository/cliente-api-repositoryi";
 
const router = Router();


  const produtoRepository = new ProdutoRepository();
  const configApi = new apiController();
  const produtoApiRepository = new ProdutoApiRepository();
  const categoryRepository = new CategoriaRepository();
  const apiConfigRepository  = new ApiConfigRepository();
  const syncEstock = new SyncStock();
  const pedidoApiRepository = new PedidoApiRepository();
  const clienteApiRepository = new ClienteApiRepository();

router.get('/', verificaToken,async (req,res) =>{
  res.render('index');
})

router.get('/config', async  ( req, res )=>{
  const data = await configApi.buscaConfig();
  const tabelas = await  produtoRepository.buscaTabelaDePreco();
  res.render('config', {'config':data , 'tabelas':tabelas});
})

router.get('/produtos', verificaToken , async (req,res) =>{
    const produtos = await produtoApiRepository.buscaTodos();
  const tabelas = await produtoRepository.buscaTabelaDePreco();
res.render('produtos',{'produtos' : produtos,   'tabelas': tabelas});
 })

 router.get('/categorias', verificaToken, async (req,res)=>{
    const data = await categoryRepository.buscaGrupoIndex()
    res.render('categorias',  { 'categorias' : data})
  })

router.get('/clientes', verificaToken, async (req,res)=>{
    const data = await clienteApiRepository.getClientIntegracao()
    console.log(data)
    res.render('clientes',  { 'clientes' : data})
  })

  
  router.get('/configuracoes', async (req,res)=>{
    let dadosConfig = await apiConfigRepository.buscaConfig();
    let objProdutos = new ProdutoRepository();
    let tabelasDePreco = await objProdutos.buscaTabelaDePreco();
    res.render('configuracoes', { dados: dadosConfig[0], tabelas: tabelasDePreco  })
    
  })

 router.post('/api/produtos', verificaToken,  async (req:Request,res:Response )=>{
    const obj =   new ProdutoController()  
    let dadosConfig = await apiConfigRepository.buscaConfig();

      if( dadosConfig[0].enviar_produtos === 'E' ){
          await obj.enviaProduto(req,res);
      }
      if( dadosConfig[0].enviar_produtos === 'S' ){
          await obj.geraVinculo(req,res);
      }
  })

 
  router.post('/api/categorias',  new CategoriaController().postCategory ) 

  router.get('/callback', async (req, res, next) => {
   const apitokenController = new TokenController;
    const token = apitokenController.obterToken(req,res,next);
  });


router.get('/pedidos', async ( req,res )=>{
  let dados = await pedidoApiRepository.findAll();
  res.render('pedidos', { pedidos: dados})
})


router.get('/estoque',verificaToken, async ()=>{
    let dadosConfig = await apiConfigRepository.buscaConfig();
    if(dadosConfig[0].enviar_estoque > 0  ){
       await syncEstock.enviaEstoque();
      }
}) 

  router.post('/ajusteConfig',verificaToken, new apiController().ajusteConfig )
 

  

     export {router} 
