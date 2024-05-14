import { Router,Request,Response, NextFunction } from "express";
  
import 'dotenv/config'; 
import { TokenController } from "./controllers/token/tokenController";
import { verificaToken } from "./Middlewares/TokenMiddleware";
import { ProdutoController } from "./controllers/produtos/ProdutoController";

import { ProdutoApi } from "./models/produtoApi/produtoApi";
import ConfigApi from "./Services/api";
import { ProdutoModelo } from "./models/produto/produtoModelo";
import { conn, db_publico } from "./database/databaseConfig";

const router = Router();

router.get('/', async (req,res) =>{

   const objProdutos = new ProdutoModelo();
    const objSincronizados = new ProdutoApi();
    const sincronizados = await objSincronizados.busca();
  const produtos = await objProdutos.buscaProdutos(conn, db_publico);

res.render('produtos',{'produtos' : produtos, 'sincronizados':sincronizados})
 })


 router.post('/teste',(req,res) =>{
  console.log(req.body);
 return  res.json({'msg':"produto enviado com sucesso!"})
   })
 
 router.get('/teste', verificaToken, async (req, res) => {
          const aux = new  ProdutoController();
          const a = await aux.enviaEstoque();
});


     router.get('/produto', verificaToken, new ProdutoController().enviaProduto)

  router.get('/callback', async (req, res, next) => {
   const apitokenController = new TokenController;
    const token = apitokenController.obterToken(req,res,next);
  });


     export {router} 
