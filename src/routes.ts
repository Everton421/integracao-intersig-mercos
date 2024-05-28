import { Router,Request,Response, NextFunction } from "express";
  
import 'dotenv/config'; 
import { TokenController } from "./controllers/token/tokenController";
import { verificaToken } from "./Middlewares/TokenMiddleware";
import { ProdutoController } from "./controllers/produtos/ProdutoController";

import { ProdutoApi } from "./models/produtoApi/produtoApi";
import ConfigApi from "./Services/api";
import { ProdutoModelo } from "./models/produto/produtoModelo";
import { conn, db_publico } from "./database/databaseConfig";
import axios from "axios";
import { ClienteErp } from "./models/cliente/clienteErp";
import { ClienteController } from "./controllers/cliente/ClienteController";
import { pedidoController } from "./controllers/pedido/pedidoController";
import { clienteApi } from "./models/clienteApi/clienteApi";
import { PedidoApi } from "./models/pedidoApi/pedidoApi";
import { apiController } from "./controllers/apiController/apiController";
import { configApi } from "./models/configApi/config";

const router = Router();


router.get('/', verificaToken,async (req,res) =>{
  res.render('index');
})

router.get('/config', async  ( req, res )=>{
  const configApi = new apiController();
  const data = await configApi.buscaConfig();
  //console.log(data)
  res.render('config', {'config':data});
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

router.get('/teste2',verificaToken, async (req,res)=>{
  const aux = new ClienteErp();
  let t =  aux.formatCep('86990000');
console.log(t);
}) 



     export {router} 
