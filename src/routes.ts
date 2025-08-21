import { Router,Request,Response, NextFunction } from "express";
  
import 'dotenv/config'; 
// import { TokenController } from "./controllers/token-controller/token-controller";
import { ProdutoController } from "./controllers/produtos-controller/produtos-controller";
import { ProdutoApiRepository } from "./dataAcess/api-produto-repository/produto-api-repository";
import { ProdutoRepository } from "./dataAcess/produto-repository/produto-repository";
import { apiController } from "./controllers/api-config-controller/api-config-controller";
import {  ApiConfigRepository } from "./dataAcess/api-config-repository/api-config-repository";
import { SyncStock } from "./Services/sync-stock/sync-stock";
import { PedidoApiRepository } from "./dataAcess/api-pedido-repository/pedido-api-repository";
import { CategoriaRepository } from "./dataAcess/categoria-repository/categoria-repository";
//import { CategoriaController } from "./controllers/categoria-controller/categoria-controller";
import { ClienteApiRepository } from "./dataAcess/api-cliente-repository/cliente-api-repositoryi";
import { pedidoController } from "./controllers/pedido-controller/pedido-controller";
import { SendTablePrice } from "./Services/send-table-price/send-table-price";
 
const router = Router();


  const produtoRepository = new ProdutoRepository();
  const configApi = new apiController();
  const produtoApiRepository = new ProdutoApiRepository();
  const categoryRepository = new CategoriaRepository();
  const apiConfigRepository  = new ApiConfigRepository();
  const syncEstock = new SyncStock();
  const pedidoApiRepository = new PedidoApiRepository();
  const clienteApiRepository = new ClienteApiRepository();
  const produtoController = new ProdutoController();

router.get('/',   async (req,res) =>{
  res.render('index');
})

router.get('/config', async  ( req, res )=>{
  const data = await configApi.buscaConfig();
  const tabelas = await  produtoRepository.buscaTabelaDePreco();
  res.render('config', {'config':data , 'tabelas':tabelas});
})

/// ok
router.get('/produtos',  async (req,res) =>{
      let obj = new ProdutoController();
  const produtos = await produtoApiRepository.buscaTodos();
  const tabelas = await produtoRepository.buscaTabelaDePreco();
res.render('produtos',{'produtos' : produtos,   'tabelas': tabelas});
 })
//ok 

// router.post('/produtos/sync', new  ProdutoController().postProduto)



 router.get('/categorias',  async (req,res)=>{
    const data = await categoryRepository.buscaGrupoIndex()
    res.render('categorias',  { 'categorias' : data})
  })

router.get('/clientes',  async (req,res)=>{
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


router.get('/lote-estoque', async ()=>{
 let aux = new SyncStock()
  await aux.postSaldo();
} )
router.get('/lote-preco', async ()=>{
 let aux = new SyncStock()
  await aux.postSaldo();
} )


router.get('/post-tabelas-preco', async ()=>{
 let aux = new SendTablePrice()
  await  aux.postTables();
})

  /*
 router.post('/api/produtos',  async (req:Request,res:Response )=>{
    const obj =   new ProdutoController()  
    let dadosConfig = await apiConfigRepository.buscaConfig();

      if( dadosConfig[0].enviar_produtos === 'E' ){
          await obj.enviaProduto(req,res);
      }
      if( dadosConfig[0].enviar_produtos === 'S' ){
          await obj.geraVinculo(req,res);
      }
  })

 */
/*
  router.post('/api/categorias',  new CategoriaController().postCategory ) 

  router.get('/callback', async (req, res, next) => {
   const apitokenController = new TokenController;
    const token = apitokenController.obterToken(req,res,next);
  });
*/

router.get('/pedidos', async ( req,res )=>{
    let obj = new pedidoController();
    await obj.buscaPedidos( 1 , '2025-06-27 16:28:00');
  
  let dados = await pedidoApiRepository.findAll();

  res.render('pedidos', { pedidos: dados})
})

/*
router.get('/estoque',  async ()=>{
    let dadosConfig = await apiConfigRepository.buscaConfig();
    if(dadosConfig[0].enviar_estoque > 0  ){
       await syncEstock.enviaEstoque();
      }
}) 
*/

  router.post('/ajusteConfig',  new apiController().ajusteConfig )
 


     export {router} 
