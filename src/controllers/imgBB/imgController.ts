import axios from "axios";
import fs from "fs";
import path from "path";

import FormData, { promises } from "form-data";
import { ProdutoModelo } from "../../models/produto/produtoModelo";

export class imgController{

async postIMGBB ( caminho:string , foto:string ){
    return new Promise( async (resolve, reject)=>{

    const apiKey = process.env.API_KEY_IMGBB

    const expiration = 9000; // Tempo de expiração em segundos
    const imagePath = path.join(caminho, foto); // Caminho para a imagem
  //  if(!imagePath || !caminho){
  //      return
  //  }
        if(fs.existsSync(imagePath)){
            console.log('arquivo existe')
        
      console.log(imagePath);

   const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
 
     const form = new FormData();
     form.append('image', imageBase64);
 
     try {
         const response = await axios.post(`https://api.imgbb.com/1/upload?expiration=${expiration}&key=${apiKey}`, form, {
             headers: {
                 ...form.getHeaders()
             }
         });
      //   console.log(  response.data.data.url);
         resolve(response.data.data.url);
         //res.json(response.data);
     } catch (error:any) {
        reject(error);
     }


    }else{
        reject('caminho nao encontrado');
        
      //  return;
    }

})

}

async postFoto( data:any ){

    const produto = new ProdutoModelo();

    const caminhoImg:any = await produto.buscaCaminhoFotos();
    const fotosProduto:any = await produto.buscaFotos(data.CODIGO);
    let linkFoto:any;
    let links:any =[];

    if( fotosProduto.length > 0 ){
       
       for( const foto of fotosProduto ){
           try{
            linkFoto =  await this.postIMGBB(caminhoImg[0].FOTOS, foto.FOTO )
            links.push( {"link":linkFoto});

        }catch(err){console.log(err+'erro ao enviar foto')}
           
        }
        return links;
    }else{
       console.log('nenhuma foto encontrada');
    }

}


}