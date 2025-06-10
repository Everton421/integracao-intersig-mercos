"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPrice = void 0;
const produto_api_repository_1 = require("../../dataAcess/api-produto-repository/produto-api-repository");
const api_1 = __importDefault(require("../api/api"));
const date_service_1 = require("../dateService/date-service");
class SyncPrice {
    constructor() {
        this.api = new api_1.default();
        this.dateService = new date_service_1.DateService();
        this.produtoApi = new produto_api_repository_1.ProdutoApiRepository();
    }
    delay(ms) {
        console.log(`Aguardando ${ms / 1000} segundos para enviar o preço...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     *
     * @param idProdutobling  id do produto no bling
     * @param preco preco a ser atualizado
     */
    async postPrice(idProdutobling, preco) {
        let objPatch = {
            "preco": preco
        };
        try {
            const resultPrecoEnviado = await this.api.config.patch(`/produtos/${idProdutobling}`, objPatch);
            if (resultPrecoEnviado.status === 200 || resultPrecoEnviado.status === 201) {
                await this.delay(1000);
                await this.produtoApi.updateByParama({ id_bling: idProdutobling, data_preco: this.dateService.obterDataHoraAtual() });
                return { ok: true, errp: false, msg: "preco atualizado com sucesso!" };
            }
        }
        catch (e) {
            console.log("Erro ao tentar atualizar preço do produto no bling ");
            console.log(e.response);
        }
    }
}
exports.SyncPrice = SyncPrice;
