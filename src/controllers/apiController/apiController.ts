import { verificaTokenTarefas } from "../../Middlewares/TokenMiddleware";
import { conn, database_api } from "../../database/databaseConfig"
import { pedidoController } from "../pedido/pedidoController";
import { ProdutoController } from "../produtos/ProdutoController";
var cron = require('node-cron');

export class apiController{


     delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async buscaConfig(){
        return new Promise( async (resolve, reject)=>{
            const sql =
            ` SELECT * FROM ${database_api}.config_bling;`
            await conn.query( sql, ( err, result )=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                
                }
            })
        })
    }

   
async   main() {
    await verificaTokenTarefas();
  
    const tempoPedido = process.env.IMPORTAR_PEDIDOS;
    const tempoEstoque = process.env.ENVIAR_ESTOQUE;
    const enviarPreco = process.env.ENVIAR_PRECO;
  
    let aux: any;
  
    const produto = new ProdutoController();
    const pedido = new pedidoController();
  
    try {
      aux = await this.buscaConfig();
    } catch (err) {
      console.log(err);
    }
  
    let config;
    if (aux.length > 0) {
      config = aux[0];
    } else {
      return;
    }
  
    if (config.importar_pedidos === 1) {
      await this.delay(8000);
  
      cron.schedule(tempoPedido, async () => {
        console.log("importando pedidos");
        await pedido.buscaPedidosBling();
      });
    }
  
    if (config.enviar_estoque === 1) {
      await  this.delay(8000);
      let estoqueExecutando = false;
  
      cron.schedule(tempoEstoque, async () => {
        if (estoqueExecutando) {
          console.log('Processo de envio de estoque já está em execução');
          return;
        }
  
        estoqueExecutando = true;
        console.log('enviando estoque');
  
        try {
          await produto.enviaEstoque();
        } catch (err) {
          console.log('Erro ao enviar estoque:', err);
        } finally {
          estoqueExecutando = false;
        }
      });
    }
  
  
  }


}