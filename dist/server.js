"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const https = require('https');
const fs = require('fs');
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const api_config_controller_1 = require("./controllers/api-config-controller/api-config-controller");
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.set('views', path_1.default.join(__dirname, 'Views'));
app.use(express_1.default.json());
app.use(routes_1.router);
app.use((0, cors_1.default)());
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        return res.status(400).json({
            error: err.message,
        });
    }
    res.status(500).json({
        status: 'error ',
        messsage: 'internal server error.'
    });
});
async function tarefas() {
    const aux = new api_config_controller_1.apiController();
    const main = await aux.main();
}
tarefas();
const PORT_API = process.env.PORT_API; // Porta padrão para HTTPS
app.listen(PORT_API, async () => {
    console.log(`app rodando porta ${PORT_API}  `);
});
