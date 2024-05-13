import axios from "axios";

export const apiToken = axios.create({
    baseURL:'https://www.bling.com.br/Api/v3/oauth/token'
})



// Codificar as credenciais para Base64
const base64Credentials = Buffer.from("[seu_client_id]:[seu_client_secret]").toString('base64');

// Configuração do cabeçalho
const headers = {
    'Host': 'https://www.bling.com.br',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': '1.0',
    'Authorization': `Basic ${base64Credentials}`
};

// Dados do corpo da solicitação
const data = {
    grant_type: 'authorization_code',
    code: '[seu_authorization_code]'
};

export const apiToken = axios.post('https://www.bling.com.br/Api/v3/oauth/token', data, { headers });
