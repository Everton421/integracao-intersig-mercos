import { Router,Request,Response, NextFunction } from "express";
  
import 'dotenv/config'; 
import axios from "axios";
import { conn_api, database_api } from "./database/databaseConfig";
import { TokenController } from "./Controllers/produtos/tokenController";
import { verificaToken } from "./Middlewares/TokenMiddleware";
const qs = require('qs'); // Importe o módulo 'qs'

const router = Router();

router.get('/',(req,res) =>{
  //return res.json(req.headers)
  //return res.json(req.body)
  return res.json({ok:'true'})

 })
     
 
 router.get('/teste', verificaToken, async (req,res) =>{
      res.send('teste')

     })

 router.get('/token',(req,res)=>{
   res.send(' token atualizado com sucesso!');
 })
 
 router.get('/erro',(req,res)=>{
  res.send('erro ao obter o novo token');
})

  router.get('/callback', async (req, res, next) => {
   const apitokenController = new TokenController;
    const token = apitokenController.obterToken(req,res,next);
  });


     export {router} 
