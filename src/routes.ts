import { Router,Request,Response, NextFunction } from "express";
  
import 'dotenv/config'; 
import { TokenController } from "./controllers/token/tokenController";
import { verificaToken } from "./Middlewares/TokenMiddleware";
import { ProdutoController } from "./controllers/produtos/ProdutoController";

import { ProdutoApi } from "./models/produtoApi/produtoApi";
import ConfigApi from "./Services/api";

const router = Router();

router.get('/',(req,res) =>{
  
  return res.json({ok:'true'})

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
