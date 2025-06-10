"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conn_api = exports.database_api = exports.db_api = exports.conn = exports.db_financeiro = exports.db_estoque = exports.db_vendas = exports.db_publico = void 0;
// import 'dotenv/config';
const mysql_1 = __importDefault(require("mysql"));
/**----------------------------------------------------------------------- */
const hostname = process.env.HOST;
const portdb = process.env.PORT_DB;
const username = process.env.USER;
const dbpassword = process.env.PASSWORD;
let port;
if (portdb !== undefined) {
    port = parseInt(portdb);
}
exports.db_publico = process.env.DB_PUBLICO;
exports.db_vendas = process.env.DB_VENDAS;
exports.db_estoque = process.env.DB_ESTOQUE;
exports.db_financeiro = process.env.DB_FINANCEIRO;
exports.conn = mysql_1.default.createPool({
    connectionLimit: 10,
    host: hostname,
    user: username,
    port: port,
    password: dbpassword,
});
/**----------------------------------------------------------------------- */
let port_db_api;
const hostApi = process.env.HOST_API;
const userApi = process.env.USER_API;
const senhaApi = process.env.PASSWORD_API;
exports.db_api = process.env.DB_API;
if (portdb !== undefined) {
    port_db_api = parseInt(portdb);
}
exports.database_api = process.env.DB_API;
exports.conn_api = mysql_1.default.createPool({
    connectionLimit: 10,
    host: hostApi,
    user: userApi,
    port: port_db_api,
    password: senhaApi,
    database: exports.db_api
});
console.log(userApi);
console.log(senhaApi);
console.log(exports.db_api);
//  conn.getConnection( (err)=>{
//      if(err){
//          console.log(err);
//      }else{
//          console.log('conectado')
//      }
//  })
/*---------------------------------------------------------------------*/
