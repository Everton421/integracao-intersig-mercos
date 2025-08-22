 import { Request, Response } from "express";
 // import { SyncCategory } 

export class CategoriaController{


    async postCategory( req:Request, res:Response ){
        console.log(req.body)
        const syncCategory = new SyncCategory();

        
            const arrSelecionados = req.body.categorias
            
        if( Array.isArray(arrSelecionados) ){
            for( const i of  arrSelecionados ){

                let result = await   syncCategory.validaCatedoria(Number(i));
                if( result && result.msg ){
                res.status(200).json({ msg:result.msg})
                } 
            }
        }
    }    

}  