"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgController = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const form_data_1 = __importDefault(require("form-data"));
const produto_repository_1 = require("../../dataAcess/produto-repository/produto-repository");
class ImgController {
    async postIMGBB(caminho, foto) {
        return new Promise(async (resolve, reject) => {
            const apiKey = process.env.API_KEY_IMGBB;
            const expiration = 9000; // Tempo de expiração em segundos
            const imagePath = path_1.default.join(caminho, foto); // Caminho para a imagem
            //  if(!imagePath || !caminho){
            //      return
            //  }
            if (fs_1.default.existsSync(imagePath)) {
                console.log('arquivo existe');
                console.log(imagePath);
                const imageBase64 = fs_1.default.readFileSync(imagePath, { encoding: 'base64' });
                const form = new form_data_1.default();
                form.append('image', imageBase64);
                try {
                    const response = await axios_1.default.post(`https://api.imgbb.com/1/upload?expiration=${expiration}&key=${apiKey}`, form, {
                        headers: {
                            ...form.getHeaders()
                        }
                    });
                    //   console.log(  response.data.data.url);
                    resolve(response.data.data.url);
                    //res.json(response.data);
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                reject('caminho nao encontrado');
                //  return;
            }
        });
    }
    async postFoto(data) {
        const produto = new produto_repository_1.ProdutoRepository();
        const caminhoImg = await produto.buscaCaminhoFotos();
        const fotosProduto = await produto.buscaFotos(data.CODIGO);
        let linkFoto;
        let links = [];
        if (fotosProduto.length > 0) {
            for (const foto of fotosProduto) {
                try {
                    linkFoto = await this.postIMGBB(caminhoImg[0].FOTOS, foto.FOTO);
                    links.push({ "link": linkFoto });
                }
                catch (err) {
                    console.log(err + 'erro ao enviar foto');
                }
            }
            return links;
        }
        else {
            console.log('nenhuma foto encontrada');
        }
    }
}
exports.ImgController = ImgController;
