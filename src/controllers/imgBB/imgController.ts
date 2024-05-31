import axios from "axios";
import fs from "fs";
import path from "path";

import FormData, { promises } from "form-data";

export class imgController{

async postFoto ( caminho:string , foto:string ){
    return new Promise( async (resolve, reject)=>{

    const apiKey = '175dce8ab4d45e54441c03f3d4e00b3d'; // Substitua pela sua chave de API do imgbb
    const expiration = 9000; // Tempo de expiração em segundos
    const imagePath = path.join(caminho, foto); // Caminho para a imagem
   // console.log(imagePath);
    // Ler a imagem e convertê-la para base64
     const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
 
     const form = new FormData();
     form.append('image', imageBase64);
 
     try {
         const response = await axios.post(`https://api.imgbb.com/1/upload?expiration=${expiration}&key=${apiKey}`, form, {
             headers: {
                 ...form.getHeaders()
             }
         });
         console.log(  response.data.data.url);
         resolve(response.data.data.url);
         //res.json(response.data);
     } catch (error:any) {
        reject(error);
     }

})

}

}