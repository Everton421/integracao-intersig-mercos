"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncCategory = void 0;
const api_1 = __importDefault(require("../api/api"));
const categoria_api_repository_1 = require("../../dataAcess/api-categoria-repository/categoria-api-repository");
const categoria_repository_1 = require("../../dataAcess/categoria-repository/categoria-repository");
class SyncCategory {
    constructor() {
        this.api = new api_1.default();
    }
    async validaCatedoria(value) {
        await this.api.configurarApi();
        const categoriaSistema = new categoria_repository_1.CategoriaRepository();
        const categoriaAPI = new categoria_api_repository_1.CategoriaApiRepository();
        let categoria = [];
        categoria = await categoriaAPI.buscaCategoriaApi(value);
        let id_bling = null;
        let codigo_sistema = null;
        let descricao = null;
        if (categoria.length > 0) {
            console.log('categoria ja esta cadastrada');
            id_bling = categoria[0].Id_bling;
            return { msg: 'categoria foi enviada' };
        }
        else {
            const cadastroSistema = await categoriaSistema.buscaGrupo(value);
            // console.log(cadastroSistema)
            if (cadastroSistema.length > 0) {
                codigo_sistema = cadastroSistema[0].CODIGO;
                descricao = cadastroSistema[0].NOME;
                const data = {
                    "descricao": descricao,
                    "categoriaPai": {
                        "id": 0
                    }
                };
                try {
                    const responseBling = await this.api.config.post('/categorias/produtos', data);
                    // console.log(responseBling.data.data)
                    id_bling = responseBling.data.data.id;
                    //   console.log(id_bling)
                    const value = { id_bling, codigo_sistema, descricao };
                    const cadastro = await categoriaAPI.cadastraCategoriaApi(value);
                    return { msg: 'categoria enviada com sucesso!' };
                }
                catch (err) {
                    console.log('erro ao enviar categoria ' + err);
                }
            }
        }
    }
}
exports.SyncCategory = SyncCategory;
