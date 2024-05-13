import { Router,Request,Response, NextFunction } from "express";
  
import 'dotenv/config'; 
import axios from "axios";
import { conn_api, database_api } from "./database/databaseConfig";
import { TokenController } from "./controllers/token/tokenController";
import { verificaToken } from "./Middlewares/TokenMiddleware";
import { ProdutoController } from "./controllers/produtos/produtos";
import { TokenModelo } from "./models/token/tokenModelo";
const qs = require('qs'); // Importe o módulo 'qs'

const router = Router();

router.get('/',(req,res) =>{
  
  return res.json({ok:'true'})

 })
     
 
 router.get('/teste', verificaToken, async (req,res) =>{
      
    const obj:any =  new  TokenModelo();
  
  let token = await obj.buscaToken()

return console.log(token);

     })

     router.get('/produto', new ProdutoController().enviaProduto)

  router.get('/callback', async (req, res, next) => {
   const apitokenController = new TokenController;
    const token = apitokenController.obterToken(req,res,next);
  });


     export {router} 
