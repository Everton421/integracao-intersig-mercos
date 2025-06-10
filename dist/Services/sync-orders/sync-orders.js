"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncORders = void 0;
const pedido_api_repository_1 = require("../../dataAcess/api-pedido-repository/pedido-api-repository");
const pedido_repository_1 = require("../../dataAcess/pedido-repository/pedido-repository");
const api_1 = __importDefault(require("../api/api"));
class SyncORders {
    constructor() {
        this.pedidoApiRepository = new pedido_api_repository_1.PedidoApiRepository();
        this.pedidoRepository = new pedido_repository_1.PedidoRepository();
        this.api = new api_1.default();
    }
    delay(ms) {
        console.log(`Aguardando ${ms / 1000} segundos para atualizar...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     *  atualiza situação do peido no bling
     * @returns
     */
    async updateBling() {
        console.log('Atualizando pedidos no bling...  ');
        const arrOrders = await this.pedidoApiRepository.findAll();
        for (const order of arrOrders) {
            const validOrder = await this.pedidoRepository.findByCode(order.codigo_sistema);
            if (validOrder.length > 0) {
                const orderErp = validOrder[0];
                if (orderErp.SITUACAO != order.situacao) {
                    console.log(`Atualizando pedido ${order.codigo_sistema} ... `);
                    let novaSituacao = 6;
                    if (orderErp.SITUACAO === 'EA') {
                        novaSituacao = 6;
                    }
                    if (orderErp.SITUACAO === 'FI') {
                        novaSituacao = 9;
                    }
                    try {
                        await this.delay(1000);
                        let resultPatchOrder = await this.api.config.patch(`/pedidos/vendas/${order.Id_bling}/situacoes/${novaSituacao}`);
                        if (resultPatchOrder.status === 200 || resultPatchOrder.status === 204) {
                            this.pedidoApiRepository.updateBYParam({ Id_bling: order.Id_bling, codigo_sistema: order.codigo_sistema, situacao: orderErp.SITUACAO });
                        }
                    }
                    catch (err) {
                        console.log(`Erro ao tentar atualizar pedido no bling `, err.response.data.error);
                        return err.response.data.message;
                    }
                    // enviar atualização do pedido
                }
                else {
                    console.log(`Pedido: ${order.codigo_sistema} sem alteração`);
                }
            }
            else {
                console.log(` pedido: ${order.codigo_sistema}, id: ${order.Id_bling}  não foi encontrado`);
            }
        }
    }
}
exports.SyncORders = SyncORders;
