import { ProdutoApiRepository } from "../../dataAcess/api-produto-repository/produto-api-repository";
import { ProdutoRepository } from "../../dataAcess/produto-repository/produto-repository";
import { SyncStock } from "../../Services/sync-stock/sync-stock";

export class EstoqueController{
        syncStoque = new  SyncStock();
        private produtoRepository = new ProdutoRepository();
        private produtoApiRepository = new ProdutoApiRepository();

    async loteEstoque(){

            let arrProdutos = await this.produtoApiRepository.buscaSincronizados();

            if( arrProdutos.length > 0 ){

                let arrSaldo=[]
                    for( let prod of arrProdutos ) {
                        let saldo = this.syncStoque.obtemSaldo(prod.Id);
                        arrSaldo.push( saldo)
                    }
                    
                    
                }
    }
}