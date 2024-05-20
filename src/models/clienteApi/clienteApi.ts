import { conn, conn_api, database_api, db_publico } from "../../database/databaseConfig";








export class clienteApi{
    data(){
        const now = new Date(); // Obtém a data e hora atuais
        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
    
        const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
    
        const dataHoraInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
        const dataInsercao = `${ano}-${mes}-${dia}`; 
        return {dataHoraInsercao, dataInsercao};
    }

    async cadastrarClientApi( json:any ){
        const {

            clientPedidoBling , dadosClientErp, cpfClientBling
        } = json;

            let dataInsercao:any = this.data().dataHoraInsercao

        return new Promise( async (resolve, reject )=>{
                const sql = ` INSERT INTO ${database_api}.clientes  (Id_bling, codigo_sistema, cpf, data_envio) 
                    values ('${clientPedidoBling}', '${dadosClientErp}', '${cpfClientBling}', '${dataInsercao}' );
                `
            await conn_api.query(sql,(err, result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }

            })
        })

    }
}    