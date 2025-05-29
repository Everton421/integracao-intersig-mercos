import { ProdutoModelo } from "../../models/produto/produtoModelo";
import { ProdutoApi } from "../../models/produtoApi/produtoApi";
import ConfigApi from "../api";

type dados = {
    codigo:number,

}

export class  SyncProduct{
         
         private   api = new ConfigApi();
         
         private  produtoApi = new ProdutoApi();

      delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }


        /// obtem vinculo do produto 
    async getVinculoProduto(dados: dados) {

            function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const api: any = new ConfigApi();
        const produtoApi = new ProdutoApi();

        let produtoSemVinculo: any = [];
        let variacaoSemVinculo: any = [];
        let tipoVariacao = 'N'
            let dadosProdutoBling:any[]=[]

            produtoSemVinculo = await this.api.config.get('/produtos', {
                params: {
                    pagina: 1,
                    limite: 100,
                    criterio: 2,
                    tipo: 'P',
                    codigo: dados.codigo
                }
            })
            await delay(1000);
        variacaoSemVinculo = await this.api.config.get('/produtos', {
                    params: {
                        pagina: 1,
                        limite: 100,
                        criterio: 2,
                        tipo: 'v',
                        codigo: dados.codigo
                    }
                })

               if(produtoSemVinculo.data.data.length > 0){
                    dadosProdutoBling = produtoSemVinculo.data.data;
                }
                if(variacaoSemVinculo.data.data.length > 0 && variacaoSemVinculo.data.data[0].idProdutoPai > 0 ){
                        dadosProdutoBling = variacaoSemVinculo.data.data;
                        tipoVariacao = 'S'

                    }
                
//            console.log(produtoSemVinculo.data.data) 
        if (dadosProdutoBling.length > 0) {
            const produtoEnviado = {
                id_bling: dadosProdutoBling[0].id,
                codigo_sistema: dados.codigo,
                descricao: dadosProdutoBling[0].nome,
                saldo: 0,
                variacao: tipoVariacao
            }

            try {
                let prod: any = await produtoApi.inserir(produtoEnviado);
                if (prod.affectedRows === 1) {
                    //console.log(`gerado vinculo para o produto ${dados.codigo}`);
                   // return produtoEnviado;
                   return { ok: true, erro:false, produto: produtoEnviado ,msg:   ` Registrado vinculo para o produto: ${ dados.codigo}     idBling: ${ dadosProdutoBling[0].id } `  }

                }
            } catch (error) {
                  //  console.log(error)
                   return { ok: false, erro: true, produto:null , msg:   ` Ocorreu um erro ao tentar registrar vinculo para o produto: ${ dados.codigo}     idBling: ${ dadosProdutoBling[0].id } `  }

            }

        } else {
       return { ok: false, erro: true, produto:null , msg:    `  Não foi encontrado produto: ${ dados.codigo} no bling `  }

        }
         
    }


async getDeposit() {

        type depositoBling = {
                id : string,
                descricao : string,
                situacao : number,
                padrao : boolean,
                desconsiderarSaldo : boolean
        }

         const resultDeposito = await this.api.config.get('/depositos');

            if(!resultDeposito.data.data){
                console.log("nao encontrado deposito no bling");
             }
         const produtoApi = new ProdutoApi();
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
    

      async postEstoque(idProdutobling:string, saldo:number, idDeposito:any, codigoProdutoSistema:number) : Promise< { ok:boolean, erro:boolean, msg:string} | undefined > {

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
                                                await this.delay(2000);
                                               // console.log(` aguardando para enviar saldo para o produto ${idProdutobling}...`)
                                                estoqueEnviado =  await this.api.config.post('/estoques', estoque);
                                               
                                                status = estoqueEnviado.status
                                                
                                                if(status === 201 || status ===200){
                                                    await this.produtoApi.atualizaSaldoEnviado(idProdutobling , saldo);
                                                  //  console.log(estoqueEnviado.data);    
                                                    //console.log(` enviado saldo para produto: ${ codigoProdutoSistema}   saldo: ${saldo}  idBling: ${ idProdutobling } `);
                                                    return { ok: true, erro:false,  msg:   ` enviado saldo para produto: ${ codigoProdutoSistema}   saldo: ${saldo}  idBling: ${ idProdutobling } `    }
                                                }
                                            }

                                            }else{
                                             //console.log(` Ocorreu um erro ao tentar enviar o saldo para o produto ${codigoProdutoSistema}  ` )
                                                return { ok:false, erro: true, msg:   ` ocorreu um erro ao tentar enviar o  saldo para produto: ${ codigoProdutoSistema}   saldo: ${saldo}  idBling: ${ idProdutobling } `   }
                                            }
                                }catch( err ){
                                         //console.log(` Ocorreu um erro ao tentar enviar o saldo para o produto ${codigoProdutoSistema}  `,err)
                                  return { erro: true, ok:false, msg:   ` ocorreu um erro ao tentar enviar o  saldo para produto: ${ codigoProdutoSistema}   saldo: ${saldo}  idBling: ${ idProdutobling } `   }
                            }
                     
       }


    async verificaVariacoes(idProdutobling: string, saldo: number, idDeposito: any ) {
        const produto = new ProdutoModelo();

      try{
        const resultDados = await this.api.config.get(`/produtos/variacoes/${idProdutobling}`);

        if (resultDados.status === 200) {
            //filtra as variações do produto 
            let resultVaricoes: any[] = resultDados.data.data.variacoes;

            // valida se a variação ja foi vinculada ao banco da integração.
            if (resultVaricoes.length > 0) {
                resultVaricoes.forEach(async (i) => {

                    let codigoProdutoSistema = 0;
                     if( i.codigo && i.codigo !== '' && i.codigo > 0 ){ 

                        codigoProdutoSistema = i.codigo
                     }  else{
                        console.log(" Variação encontrada, porém nao possui codigo sku cadastrado")
                        return;
                     }

                const resultSaldoProduto = await produto.buscaEstoqueReal(codigoProdutoSistema)
                            const saldoProduto =  resultSaldoProduto[0].ESTOQUE;

                    let resultVaricoesApi = await this.produtoApi.findByIdBling(i.id)

                    if (resultVaricoesApi.length > 0) {
                        // já foi vinculada, fazer o envio do saldo para esta variação
                        await this.postEstoque(i.id, saldoProduto, idDeposito, i.codigo)
                    } else {
                        // nao foi vinculado, gerar vinculo e enviar saldo

                        const produtoEnviado = {
                            id_bling: String(i.id),
                            codigo_sistema: codigoProdutoSistema,
                            descricao: String(i.nome),
                            saldo: 0,
                            variacao: 'S'
                        }

                        try {
                            let prod: any = await this.produtoApi.inserir(produtoEnviado);
                            if (prod.affectedRows === 1) {
                                await this.postEstoque(i.id, saldoProduto, idDeposito, codigoProdutoSistema)
                                console.log(`gerado vinculo para a variação do produto ${codigoProdutoSistema}`);
                                return { ok: true, msg: `gerado vinculo para a variação do produto ${codigoProdutoSistema}` }
                            }
                        } catch (error) {
                            return { erro: true, msg: error }
                        }

                    }

                })
            }
        }
        }catch(e:any){
            console.log(`Erro ao tentar consultar variações do produto ${idProdutobling} ` , e.response.data)
        }
    }
}