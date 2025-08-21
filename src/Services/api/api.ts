import axios from "axios";
//import { ApiTokenRepository } from "../../dataAcess/api-token-repository/api-token-repository";
//
//export class ConfigApi {
//    config: any;
//
//    constructor() {
//        this.configurarApi();
//    }
//
//    async configurarApi() {
//        try {
//            const baseUrl = process.env.BASE_URL;
//
//            let companyToken =  process.env.COMPANYTOKEN
//             let applicationToken = process.env.APPLICATIONTOKEN
//
//            // Cria a instância do axios com o token
//            this.config = axios.create({
//                baseURL: baseUrl,
//                headers: {
//                    'Content-Type': 'application/json',
//                    'ApplicationToken': applicationToken,
//                    'CompanyToken':companyToken
//                }
//            });
//        } catch (error:any) {
//            throw new Error(`Erro ao configurar API: ${error.message}`);
//        }
//    }
//
//
//}
//
//export default ConfigApi;
//
         let companyToken =  process.env.COMPANYTOKEN
        let applicationToken = process.env.APPLICATIONTOKEN
        const baseUrl = process.env.BASE_URL;


export const api = axios.create({
    baseURL:baseUrl,
        headers: {
                    'Content-Type': 'application/json',
                    'ApplicationToken': applicationToken,
                    'CompanyToken':companyToken
                }
})
