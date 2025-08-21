import { IProdutoApiSystem, ProdutoApiRepository } from "../dataAcess/api-produto-repository/produto-api-repository";
import { ProdutoRepository } from "../dataAcess/produto-repository/produto-repository";
import { api } from "./api/api";

 
// Definição do tipo para o item do lote para a API, para maior clareza
type LoteApiItem = {
    produto_id: number;
    tabela_id:number;
    preco:number;
};

// Definição do tipo para o item que será atualizado no banco local
type LoteDbUpdateItem = {
      codigo_sistema:number
      Id:number,
      preco:number
      data_preco:string
};


export class SyncPrice {

          private produtoRepository = new ProdutoRepository();
          private produtoApiRepository = new ProdutoApiRepository();
         private readonly TAMANHO_LOTE = 300;

 


    private async enviarLoteEAtualizarDB(loteParaApi: LoteApiItem[], loteParaAtualizarDB: LoteDbUpdateItem[]): Promise<void> {
        if (loteParaApi.length === 0) {
                console.log("Nenhum item no lote para enviar.");
                return;
            }

        console.log(`Enviando lote com ${loteParaApi.length} itens...`);

            try {
                // 1. Envia o lote para a API externa
                const resultApi = await api.post("/v1/produtos_tabela_preco_em_lote",  
                    loteParaApi // A API provavelmente espera um objeto com os itens
                );

                // 2. Se a API respondeu com sucesso, atualiza o banco local
                if (resultApi.status === 200 || resultApi.status === 201) {
                    console.log("Lote enviado com sucesso para a API. Atualizando banco de dados local...");

                    for (const item of loteParaAtualizarDB) {
                        console.log(item)

                        await this.produtoApiRepository.updateByParama({ 
                                Id: String(item.Id), 
                            saldo: item.preco, 
                            data_estoque: item.data_preco 
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
///

      async postPrice(): Promise<void> {

            let itens :IProdutoApiSystem[] = [];
            let loteParaApi: LoteApiItem[] = [];
            let loteParaAtualizarDB: LoteDbUpdateItem[] = [];
        
        try {

            try{
                  itens = await this.produtoApiRepository.findSynced();
            }catch(e){  console.log("Erro ao obter produtos sincronizados", e)};
              //  console.log(`Encontrados ${itens.length} produtos para verificar.`);
            if (itens.length === 0) {
                console.log("Nenhuma tabela de preço para processar.");
                return;
            }

                    for (const item of itens) {
                        try{    
                                let arrPriceSistem = await this.produtoRepository.buscaPreco(item.CODIGO);

                                if ( arrPriceSistem.length > 0 ){
                                    for( let i of arrPriceSistem ){ 
                                        if( new Date(i.DATA_RECAD_SISTEMA) > new Date(i.DATA_PRECO_INTEGRACAO) ){
                                            loteParaApi.push({ preco: i.PRECO, produto_id: Number(item.Id), tabela_id:i.id_tabela   })
                                            loteParaAtualizarDB.push(
                                                {
                                                    codigo_sistema: Number(item.CODIGO),
                                                     Id: Number(item.Id )  ,
                                                     preco: i.PRECO,
                                                     data_preco: String(i.DATA_RECAD_SISTEMA)
                                                    }
                                                )
                                        }
                                    }
                                }

                                if ( loteParaApi.length >= this.TAMANHO_LOTE ){
                                    // enviar dados 
                                                // Limpa os arrays para o próximo lote
                                        loteParaApi = [];
                                        loteParaAtualizarDB = [];
                                    }

                        }catch( e:any ){    

                        }
                    // IMPORTANTE: Envia o último lote, que pode ter menos de 300 itens
                        if( loteParaApi.length > 0 ){
                        console.log("Processando o último lote de itens...");
                            //
                        }
                    }
             } catch (e) {
            console.error("Erro fatal durante o processo de sincronização de saldo.", e);
        }
    }


  

}
 