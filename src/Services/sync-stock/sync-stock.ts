




import { ProdutoRepository } from "../../dataAcess/produto-repository/produto-repository";
import { IProdutoApiSystem, ProdutoApiRepository } from "../../dataAcess/api-produto-repository/produto-api-repository";
import { api } from "../api/api";

// Definição do tipo para o item do lote para a API, para maior clareza
type LoteApiItem = {
    produto_id: number;
    novo_saldo: number;
};

// Definição do tipo para o item que será atualizado no banco local
type LoteDbUpdateItem = {
    Id: number;
    saldo: number;
    data_estoque: string;
};

export class SyncStock {

    private produtoRepository = new ProdutoRepository();
      protected produtoApiRepository = new ProdutoApiRepository();
    private readonly TAMANHO_LOTE = 300;

    private delay(ms: number) {
        console.log(`Aguardando ${ms / 1000} segundos...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Envia um lote de saldos para a API e, se bem-sucedido,
     * atualiza os dados no banco de dados local.
     */
    private async enviarLoteEAtualizarDB(loteParaApi: LoteApiItem[], loteParaAtualizarDB: LoteDbUpdateItem[]): Promise<void> {
        if (loteParaApi.length === 0) {
            console.log("Nenhum item no lote para enviar.");
            return;
        }

        console.log(`Enviando lote com ${loteParaApi.length} itens...`);

        try {
            // 1. Envia o lote para a API externa
            const resultApi = await api.post("/v1/ajustar_estoque_em_lote",  
                 loteParaApi // A API provavelmente espera um objeto com os itens
             );

            // 2. Se a API respondeu com sucesso, atualiza o banco local
            if (resultApi.status === 200 || resultApi.status === 201) {
                console.log("Lote enviado com sucesso para a API. Atualizando banco de dados local...");
                for (const item of loteParaAtualizarDB) {
                    console.log(item)
                    // O método updateByParama precisa ser ajustado para receber os parâmetros corretos
                    await this.produtoApiRepository.updateByParama({ 
                        Id: String(item.Id) , 
                        saldo: item.saldo, 
                        data_estoque: item.data_estoque 
                    });
                }
                console.log("Banco de dados local atualizado.");
            } else {
                console.error(`API retornou status inesperado: ${resultApi.status}`);
            }
        } catch ( e:any ) {
            console.error("Erro ao enviar lote de estoque para a API ou ao atualizar o banco local.", e.response.data);
        }
    }


    ////////////////////////
    
    async postSaldo() {
        let loteParaApi: LoteApiItem[] = [];
        let loteParaAtualizarDB: LoteDbUpdateItem[] = [];

        try {
    //        console.log("Buscando produtos sincronizados...");
            let itens:any = [];
            try{
                  itens = await this.produtoApiRepository.findSynced();
            }catch(e){  console.log("Erro ao obter produtos sincronizados", e)};
              //  console.log(`Encontrados ${itens.length} produtos para verificar.`);
            if (itens.length === 0) {
                console.log("Nenhum produto sincronizado para processar.");
                return;
            }

            for (const item of itens) {
                try {
                    const arrSaldo = await this.produtoRepository.buscaEstoqueRealPorSetor(item.codigo_sistema, 1);

                    if (arrSaldo.length > 0) {
                        const saldoInfo = arrSaldo[0];
                        const dataEstoqueLocal = new Date(saldoInfo.DATA_RECAD);
                        const dataEstoqueApi = new Date(item.data_estoque);

                        // CORREÇÃO DA LÓGICA: Atualiza se a data do estoque local for mais recente
                        if (dataEstoqueLocal > dataEstoqueApi) {
                            
                            // Adiciona o item aos lotes
                            loteParaApi.push({
                                produto_id: Number(item.Id),
                                novo_saldo: Number(saldoInfo.ESTOQUE.toFixed(2))
                            });

                            loteParaAtualizarDB.push({
                                Id: Number(item.Id),
                                saldo: saldoInfo.ESTOQUE,
                                data_estoque: saldoInfo.DATA_RECAD
                            });
                            
                            // Se o lote atingiu o tamanho máximo, envia e limpa
                            if (loteParaApi.length >= this.TAMANHO_LOTE) {
                                await this.enviarLoteEAtualizarDB(loteParaApi, loteParaAtualizarDB);
                                
                                // Limpa os arrays para o próximo lote
                                loteParaApi = [];
                                loteParaAtualizarDB = [];
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Erro ao processar o produto com código: ${item.codigo_sistema}`, e);
                    // Continua para o próximo item
                }
            }

            // IMPORTANTE: Envia o último lote, que pode ter menos de 300 itens
            if (loteParaApi.length > 0) {
                console.log("Processando o último lote de itens...");
                await this.enviarLoteEAtualizarDB(loteParaApi, loteParaAtualizarDB);
            }

            console.log("Sincronização de saldo concluída.");

        } catch (e) {
            console.error("Erro fatal durante o processo de sincronização de saldo.", e);
        }
    }

    
}



/*

import { ProdutoRepository } from "../../dataAcess/produto-repository/produto-repository";
import { IProdutoApiSystem, ProdutoApiRepository } from "../../dataAcess/api-produto-repository/produto-api-repository";
import { DateService } from "../dateService/date-service";
import { api } from "../api/api";


export class SyncStock{
     

  
    private delay(ms: number) {
            console.log(`Aguardando ${ms / 1000} segundos...`);
                return new Promise(resolve => setTimeout(resolve, ms));
        }

        private produtoRepository = new ProdutoRepository();
        private produtoApiRepository = new ProdutoApiRepository();
 
      async obtemSaldo( id:any )  {
            let arrItem = await this.produtoApiRepository.findById(id);
                if( arrItem.length >  0 ){

                    let item = arrItem[0];
                    let resultSaldoItem = await this.produtoRepository.buscaEstoqueReal(item.codigo_sistema);
                    if( resultSaldoItem.length > 0 ){
                        if( new Date(resultSaldoItem[0].DATA_RECAD ) >  new Date(item.data_estoque) ){
                        return { produto_id: item.Id, novo_saldo: resultSaldoItem[0].ESTOQUE.toFixed(2) }
                        }else{

                        }
                    }
                }
        }
 

    async postSaldo(){

         let itens:IProdutoApiSystem[] =[];
         let arrPostItens: [ { produto_id:number, novo_saldo:number }] | any[] = [] 
         let arrUpdateDatabase:any[] = []
             try{
                    itens = await this.produtoApiRepository.findSynced();
             }catch(e){
                 console.log("erro ao obter produtos sincronizados ", e )
             }

                 if( itens.length > 0 ){

                        for( let i of itens  ){
                            
                                let arrSaldo:[{ CODIGO: number ,ESTOQUE: number ,DATA_RECAD: string  }] | [] =[]
                            try{
                              arrSaldo = await this.produtoRepository.buscaEstoqueRealPorSetor(i.codigo_sistema, 1 );
                            }catch(e){
                                console.log("erro ao tentar obter o saldo do produto ", e)
                            }
                            
                            if(arrSaldo.length > 0  ){
                                if( arrUpdateDatabase.length === 300 && arrPostItens.length === 300 ){
                                    try{
                                        let resultApi = await api.post("/v1/ajustar_estoque_em_lote")
                                        if( resultApi.status === 200 || resultApi.status === 201){
                                            for( let item of arrUpdateDatabase ){
                                                await this.produtoApiRepository.updateByParama( item )
                                            } 
                                        }
                                    }catch(e){
                                        console.log("Erro ao tentar enviar estoque em lote para o mercos ")
                                    }
                                }else{
                                    if( arrUpdateDatabase.length < 300 && arrPostItens.length < 300 ){
                                        if( arrSaldo[0]?.DATA_RECAD &&  new Date(i.data_estoque ) > new Date( arrSaldo[0]?.DATA_RECAD) ){
                                            arrUpdateDatabase.push({ data_estoque: arrSaldo[0]?.DATA_RECAD, saldo: arrSaldo[0].ESTOQUE ,Id:i.Id}   )
                                            arrPostItens.push( { produto_id: Number(i.Id), novo_saldo:arrSaldo[0].ESTOQUE  } )
                                        } 
                                    }

                                }
                            }



                            
                        }
                     
                 }

    }


}

*/