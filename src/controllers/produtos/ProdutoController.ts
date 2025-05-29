import { Response, Request } from "express";
import { ProdutoModelo } from "../../models/produto/produtoModelo";
import ConfigApi from "../../Services/api";
import { ProdutoApi } from "../../models/produtoApi/produtoApi";
import { categoriaController } from "../categoria/categoriaController";
import { verificaTokenTarefas } from "../../Middlewares/TokenMiddleware";
import { SyncProduct } from "../../Services/syncProducts.ts/SyncProduct";

export class ProdutoController {
  
  
 
    
    async enviaProduto( req:Request, res:Response) {
         
        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

       const  produtoSelecionados:string[] = req.body.produtos  ;

        const produto = new ProdutoModelo();
        const produtoApi = new ProdutoApi();
        
        const syncProduct = new SyncProduct();
        let responseIntegracao 
                        
        if( Array.isArray(produtoSelecionados)  ){

            responseIntegracao = await Promise.all(
                produtoSelecionados.map( async (i)=>{
                                        const codigoSistema:number = parseInt(i);
                                        const produtoSincronizado = await produtoApi.findByCodeSystem( parseInt(i));

                                        const resultSaldoProduto = await produto.buscaEstoqueReal(codigoSistema)
                                        const saldoProduto =  resultSaldoProduto[0].ESTOQUE;

                                        const resultDeposito = await produtoApi.findDefaultDeposit();
                                        let idDepositoBling;
                                            if(resultDeposito.length > 0 ){
                                                idDepositoBling = resultDeposito[0].Id_bling;
                                            }else{
                                              idDepositoBling = await syncProduct.getDeposit(); 
                                            }
                                         
                                       //verifica se ja foi enviado, consultando o banco da integração
                                       if(produtoSincronizado.length > 0 ){
                                                    
                                        let resultSaldoEnviado :any[]=[]
                                                        let resultPostEstoque

                                                            await delay(1000)
                                                                 resultPostEstoque =  await syncProduct.postEstoque( produtoSincronizado[0].Id_bling, saldoProduto, idDepositoBling, produtoSincronizado[0].codigo_sistema)
                                                                resultSaldoEnviado.push(resultPostEstoque)
                                                return  resultPostEstoque ;       
                                                            
                                        }else{  
                                            // produto não foi enviado ainda, é necessario fazer o primeiro envio
                                            await  delay(1000)
                                                let resultVinculo =  await syncProduct.getVinculoProduto( { codigo: codigoSistema  })
                                                
                                            if(   resultVinculo?.ok ){
                                                    await   delay(1000)
                                                    let prodVinculo;
                                                    let resultEstoque;
                                                    if( resultVinculo?.produto !== null ){
                                                            prodVinculo = resultVinculo?.produto
                                                    
                                                        resultEstoque = await syncProduct.postEstoque( prodVinculo.id_bling, saldoProduto, idDepositoBling, prodVinculo?.codigo_sistema)
                                                        } 
                                                        return   resultEstoque 
                                                    }else{
                                              // console.log(`ocorreu um erro ao tentar registrar o vinculo do produto ${codigoSistema}`)
                                            //  responseIntegracao = resultVinculo; 
                                                     //   let formatresult :{ ok:boolean, erro:boolean, msg:string[] } | undefined = { ok:resultVinculo?.ok, erro: resultVinculo?.erro, msg:resultVinculo.msg }
                                                return  resultVinculo ;
                                                }
                                        }     
                                                 
                                            
                            })
                    )
         

        }else{
            console.log(" é necessario que seja informado um array com os codigos dos produtos")
        }
 
          return res.status(200).json({ msg:responseIntegracao?.map((i)=> i?.msg)})

    }
    
    async novoEnvioEstoque( req:Request, res:Response){
        
            const  produtoSelecionados:string[] = req.body.produtos  ;
            const produto = new ProdutoModelo();
            const syncProduct = new SyncProduct();
            const produtoApi = new ProdutoApi();


            if( Array.isArray(produtoSelecionados)  ){
                    produtoSelecionados.forEach( async (i)=>{
                       
                          const codigoSistema:number = parseInt(i);
                          const resultDeposito = await produtoApi.findDefaultDeposit();
                          const produtoSincronizado = await produtoApi.findByCodeSystem( parseInt(i));

                              let idDepositoBling;
                            if(resultDeposito.length > 0 ){
                                  idDepositoBling = resultDeposito[0].Id_bling;
                            }else{
                               idDepositoBling = await syncProduct.getDeposit(); 
                            }

                         produtoSincronizado.forEach( async (i)=>{
                                    const resultSaldoProduto = await produto.buscaEstoqueReal(codigoSistema)
                                    const saldoProduto =  resultSaldoProduto[0].ESTOQUE;
                                            await syncProduct.postEstoque(i.Id_bling, saldoProduto,idDepositoBling,i.codigo_sistema)

                                        })

                                })
                    }

        }


    async enviaEstoque(){
        await verificaTokenTarefas();
        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

                    const  api:any = new ConfigApi();
                    const produtoApi = new ProdutoApi();
                    const produto = new ProdutoModelo();
                    const syncProduct = new SyncProduct();

        try{
            await api.configurarApi(); // Aguarda a configuração da API
                
          
                            const resultDeposito = await produtoApi.findDefaultDeposit();
                    
                           let idDepositoBling;
                            if(resultDeposito.length > 0 ){
                                  idDepositoBling = resultDeposito[0].Id_bling;
                            }else{
                               idDepositoBling = await syncProduct.getDeposit(); 
                                if(!idDepositoBling || isNaN(idDepositoBling) ){
                                        console.log("ocoreu um erro ao tentar obter o deposito")
                                    return;
                                }   
                            }


                const produtosEnviados:any = await produtoApi.buscaSincronizados();
                if(produtosEnviados.length > 0 ){

                for(const data of produtosEnviados){
                          const resultSaldo:any = await  produto.buscaEstoqueReal(data.codigo_sistema);

                    let saldo_enviado =  data.saldo_enviado;
                            

                          let saldoReal;
                          if(resultSaldo.length > 0  ){
                            saldoReal = resultSaldo[0].ESTOQUE;
                          }else{
                            saldoReal = 0;
                          }

                          if( saldo_enviado !== saldoReal ){
                            
                                    let estoque=  {
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

                                        try{
                                            let status;
                                            let estoqueEnviado;
                                            estoqueEnviado = await api.config.post('/estoques', estoque);
                                            status = estoqueEnviado.status

                                          console.log(estoqueEnviado.status);
                                            
                                          if(status !== 201){
                                            
                                            while(status !== 201 || status !== 200){
                                                await delay(2000);
                                               console.log(` aguardando para enviar saldo para o produto ${data.codigo_sistema}...`)
                                                estoqueEnviado =  await api.config.post('/estoques', estoque);
                                               
                                                status = estoqueEnviado.status
                                                
                                                if(status === 201 || status ===200){
                                                    await produtoApi.atualizaSaldoEnviado(data.Id_bling,saldoReal);
                                                    console.log(estoqueEnviado.data);    
                                                    console.log(` enviado saldo para produto: ${data.codigo_sistema }   saldo: ${saldoReal}  idBling: ${ data.Id_bling} `);
                                                }
                                            }

                                            }else{
                                                console.log(` enviado saldo para produto: ${data.codigo_sistema }   saldo: ${saldoReal}  idBling: ${ data.Id_bling} `);
                                                await produtoApi.atualizaSaldoEnviado(data.Id_bling,saldoReal);
                                            }
                                                    
                                         }catch(err){
                                            console.log(estoque);
                                                console.log(err + ` erro ao enviar o estoque para o produto ${data.codigo_sistema} `);
                                            
                                            }
                                            await delay(2000);
                                        
                                        }else{

                                            console.log(`ultimo saldo enviado para o produto ${data.codigo_sistema} igual ao saldo atual, saldo nao enviado`);
                                        }
                                 }
                        
                        }
                            console.log('fim do processo')

       }catch( error ){
                 console.log(error )
                 }
    }



}
