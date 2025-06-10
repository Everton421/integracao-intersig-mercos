"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncClient = void 0;
const cliente_api_repositoryi_1 = require("../../dataAcess/api-cliente-repository/cliente-api-repositoryi");
const cliente_repositori_1 = require("../../dataAcess/cliente-repository/cliente-repositori");
const api_1 = __importDefault(require("../api/api"));
class SyncClient {
    constructor() {
        this.clienteRepository = new cliente_repositori_1.ClienteRepository();
        this.clienteApiRepository = new cliente_api_repositoryi_1.ClienteApiRepository();
        this.api = new api_1.default();
    }
    /**
     *  processa o cliente vindo do bling, valida a existencia e retorna o codigo do cliente
     * @param idClient id do cliente no bling
     * @param cpf cpf do cliente vindo do bling
     * @returns
     */
    async getClient(idClient, cpf) {
        let clientvalidacao = [];
        try {
            clientvalidacao = await this.clienteRepository.buscaPorCnpj(cpf);
        }
        catch (err) {
            console.log("erro ao validar cliente no banco do sistema função: getClint service/SyncClient  ", err);
        }
        let dadosClientBling;
        let codigoClientErp = 0;
        if (clientvalidacao.length > 0) {
            codigoClientErp = clientvalidacao[0].CODIGO;
        }
        else {
            await this.api.configurarApi();
            try {
                dadosClientBling = await this.api.config.get(`/contatos/${idClient}`);
                try {
                    const resposta = dadosClientBling.data.data;
                    console.log('cadastrando cnpj: ', cpf);
                    try {
                        const clientCadastradoErp = await this.clienteRepository.cadastrarClientErp(resposta);
                        codigoClientErp = clientCadastradoErp.insertId;
                        if (codigoClientErp > 0) {
                            try {
                                const respostaClienteApi = await this.clienteApiRepository.cadastrarClientApi({ id_bling: Number(idClient), codigoCliente: codigoClientErp, cpf: cpf });
                                //console.log(respostaClienteApi)
                            }
                            catch (err) {
                                console.log("erro ao inserir clienteApi função: getClint service/SyncClient  " + err);
                            }
                        }
                    }
                    catch (err) {
                        console.log('erro ao cadastrar o cliente no banco de dados do sistema função: getClint service/SyncClient  ', err);
                    }
                }
                catch (err) {
                    console.log("Erro a tentar consultar o cliente no bling função: getClint service/SyncClient  ", err.response.data);
                }
            }
            catch (err) {
                console.log("Erro a tentar consultar o cliente no bling função: getClint service/SyncClient  ", err.response.data);
            }
        }
        return codigoClientErp;
    }
}
exports.SyncClient = SyncClient;
