import express,{NextFunction, Request,Response} from 'express';
import "express-async-errors";
import cors from 'cors';
const https = require('https');
const fs = require('fs');
import 'dotenv/config';
import bodyParser from 'body-parser';
import path from 'path'; 

import { router } from './routes';
import { conn } from './database/databaseConfig';
import { apiController } from './controllers/api-config-controller/api-config-controller';
import { verificaTokenTarefas } from './Middlewares/TokenMiddleware';

        const app = express();

        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
        app.set('views', path.join(__dirname, 'Views'));
        
        app.use(express.json());    
        app.use(router)
        app.use(cors());
        app.use(
                (err:Error, req:Request, res:Response, next:NextFunction)=>{
                    if(err instanceof Error){
                        return res.status(400).json({
                            error: err.message,
                        })
                    }
                    res.status(500).json({
                        status:'error ',
                        messsage: 'internal server error.'
                    })
                })

                async function tarefas(){ 
                 const aux = new apiController();
                const main = await aux.main();
            }

            tarefas();

                const PORT_API = process.env.PORT_API; // Porta padrão para HTTPS



   app.listen(PORT_API, async ()=>{ 

    console.log(`app rodando porta ${PORT_API}  `)
    
})
   

