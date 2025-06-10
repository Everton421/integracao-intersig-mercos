import { verificaTokenTarefas } from "../../Middlewares/TokenMiddleware";
import { ProdutoRepository } from "../../dataAcess/produto-repository/produto-repository";
import { ProdutoApiRepository } from "../../dataAcess/api-produto-repository/produto-api-repository";
import ConfigApi from "../api/api";
import { DateService } from "../dateService/date-service";


export class SyncStock{
     

              private dateService = new DateService();
              private produtoApi = new ProdutoApiRepository();
              private produto = new ProdutoRepository();
              private api = new ConfigApi();

    private delay(ms: number) {
            console.log(`Aguardando ${ms / 1000} segundos...`);
                return new Promise(resolve => setTimeout(resolve, ms));
        }


/**
 * 
 * @param idProdutobling :id do produto no bling
 * @param saldo saldo a ser enviado
 * @param idDeposito id do deposito no bling 
 * @param codigoProdutoSistema codigo do produto no sistema
 * @param data_estoque daa de envio do estoque
 * @returns 
 */
  async postEstoque(idProdutobling:string, saldo:number, idDeposito:any, codigoProdutoSistema:number, data_estoque:string) : Promise< { ok:boolean, erro:boolean, msg:string} | undefined > {
            await this.api.configurarApi();
                        let estoque=  {
                               "produto": {
                               "id": idProdutobling
                               },
                               "deposito": {
                               "id": idDeposito
                               },
                               "operacao": "B",
                               "preco": 0,
                               "custo": 0,
                               "quantidade": saldo,
                               "observacoes": ""
                           }
                           try{
                                   let status;
                                   let estoqueEnviado;
                                   const resultEstoqueEnviado = await this.api.config.post('/estoques', estoque);
                                   status = resultEstoqueEnviado.status
                                 if(status !== 201 || status !== 200 ){
                                   
                                   while(status !== 201 || status !== 200){
                                       await this.delay(1000);
                                      // console.log(` aguardando para enviar saldo para o produto ${idProdutobling}...`)
                                       estoqueEnviado =  await  this.api.config.post('/estoques', estoque);
                                       status = estoqueEnviado.status
                                       if(status === 201 || status ===200){
                                           await this.produtoApi.atualizaSaldoEnviado(idProdutobling , saldo, this.dateService.formatarDataHora(data_estoque));
                                         //  console.log(estoqueEnviado.data);    
                                           //console.log(` enviado saldo para produto: ${ codigoProdutoSistema}   saldo: ${saldo}  idBling: ${ idProdutobling } `);
                                           return { ok: true, erro:false,  msg:   ` enviado saldo para produto: ${ codigoProdutoSistema}   saldo: ${saldo}  idBling: ${ idProdutobling } `    }
                                       }
                                   }
                                   }else{
                                       return { ok:false, erro: true, msg:   ` ocorreu um erro ao tentar enviar o  saldo para produto: ${ codigoProdutoSistema}   saldo: ${saldo}  idBling: ${ idProdutobling } `   }
                                   }
                       }catch( err ){
                                 console.log(` Ocorreu um erro ao tentar enviar o saldo para o produto ${codigoProdutoSistema}  `,err)
                         return { erro: true, ok:false, msg:   ` ocorreu um erro ao tentar enviar o  saldo para produto: ${ codigoProdutoSistema}   saldo: ${saldo}  idBling: ${ idProdutobling } `   }
                   }
      }


  /**
   *  obtem os depositos do bling
   * @returns 
   */
    async getDeposit() {
                
            await this.api.configurarApi();
                  type depositoBling = {
                          id : string,
                          descricao : string,
                          situacao : number,
                          padrao : boolean,
                          desconsiderarSaldo : boolean
                  }
                  const resultDeposito = await   this.api.config.get('/depositos');
                      if(!resultDeposito.data.data){
                          console.log("nao encontrado deposito no bling");
                      }
                  const produtoApi = new ProdutoApiRepository();
                      const arrDeposito:depositoBling[] = resultDeposito.data.data 
                          let  id_bling; 
                          
                          let objeDeposit:any ;
                          if(arrDeposito.length > 0 ){
                              arrDeposito.forEach((i)=>{
                                  id_bling = i.id
                                  if( i.padrao === true ){
                                      
                                  objeDeposit = { id_bling: i.id, descricao:i.descricao ,desconsiderarSaldo:i.padrao, situacao:i.situacao, padrao: 'S' };
                                  }
                              })
                              try{
                                  await produtoApi.insertDeposit(objeDeposit)
                          }catch(e){
                              console.log(e)
                              return;
                          }
                          return id_bling;
                          }else{
                              return null;
                          }
       }
                 
    /** faz o envio automatico do saldo dos produtos  
   * @returns  
    */
    async enviaEstoque() {
        await verificaTokenTarefas();
        
            await this.api.configurarApi();

        try {
            await    this.api.configurarApi(); // Aguarda a configuração da API

            const resultDeposito = await this.produtoApi.findDefaultDeposit();

            let idDepositoBling;
            if (resultDeposito.length > 0) {
                idDepositoBling = resultDeposito[0].Id_bling;
            } else {
                idDepositoBling = await this.getDeposit();
                if (!idDepositoBling || isNaN(idDepositoBling)) {
                    console.log("ocoreu um erro ao tentar obter o deposito")
                    return;
                }
            }

            const produtosEnviados: any = await this.produtoApi.buscaSincronizados();
            if (produtosEnviados.length > 0) {

                for (const data of produtosEnviados) {
                    const resultSaldo: any = await this.produto.buscaEstoqueReal(data.codigo_sistema, 1);

                    let saldo_enviado = data.saldo_enviado;


                    let saldoReal;
                    let data_estoque;
                    if (resultSaldo.length > 0) {
                        saldoReal = resultSaldo[0].ESTOQUE;
                        data_estoque = resultSaldo[0].DATA_RECAD
                    } else {
                        saldoReal = 0;
                        data_estoque = '0000-00-00 00:00:00'
                    }

                    if (saldo_enviado !== saldoReal) {

                        let estoque = {
                            "produto": {
                                "id": data.Id_bling
                            },
                            "deposito": {
                                "id": idDepositoBling
                            },
                            "operacao": "B",
                            "preco": 0,
                            "custo": 0,
                            "quantidade": saldoReal,
                            "observacoes": ""
                        }

                        try {
                            let status;
                            let estoqueEnviado;
                            estoqueEnviado = await  this.api.config.post('/estoques', estoque);
                            status = estoqueEnviado.status
                            console.log(estoqueEnviado.status);

                            if (status !== 201) {
                                while (status !== 201 || status !== 200) {
                                    await this.delay(2000);
                                    console.log(` aguardando para enviar saldo para o produto ${data.codigo_sistema}...`)
                                    estoqueEnviado = await this.api.config.post('/estoques', estoque);

                                    status = estoqueEnviado.status

                                    if (status === 201 || status === 200) {
                                        await this.produtoApi.atualizaSaldoEnviado(data.Id_bling, saldoReal, data_estoque);
                                        console.log(estoqueEnviado.data);
                                        console.log(` enviado saldo para produto: ${data.codigo_sistema}   saldo: ${saldoReal}  idBling: ${data.Id_bling} `);
                                    }
                                }
                            } else {
                                console.log(` enviado saldo para produto: ${data.codigo_sistema}   saldo: ${saldoReal}  idBling: ${data.Id_bling} `);
                                await this.produtoApi.atualizaSaldoEnviado(data.Id_bling, saldoReal, data_estoque);
                            }
                        } catch (err) {
                            console.log(estoque);
                            console.log(err + ` erro ao enviar o estoque para o produto ${data.codigo_sistema} `);
                        }
                        await this.delay(2000);
                    } else {
                        console.log(`ultimo saldo enviado para o produto ${data.codigo_sistema} igual ao saldo atual, saldo nao enviado`);
                    }
                }

            }
            console.log('fim do processo')

        } catch (error) {
            console.log(error)
        }
    }
    
}