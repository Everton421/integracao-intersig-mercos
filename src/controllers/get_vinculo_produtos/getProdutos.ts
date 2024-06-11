import ConfigApi from "../../Services/api";
import { conn_api, database_api } from "../../database/databaseConfig";
import { ProdutoModelo } from "../../models/produto/produtoModelo";
import { ProdutoApi } from "../../models/produtoApi/produtoApi";

export class getProdutos{

     delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatDescricao(descricao: string): string {
      return descricao.replace(/[\\\|/"'″]/g, '');
        }

    async criarVinculo(){


        const now = new Date(); // Obtém a data e hora atuais

        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
  
        const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
  
        const dataInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

        const produto = new  ProdutoApi();
        const  api:any = new ConfigApi();
        const produtoErp = new ProdutoModelo(); 

        let produtos:any=[];
        await api.configurarApi(); // Aguarda a configuração da API
        
      let pagina = 1;
      let continuar = true;
       
      while(continuar){


        try{
         
              const response  = await api.config.get(`/produtos`,{
                params: {
                  pagina: pagina,
                  tipo: 'P',
                  criterio:2
                }
              })  

              let  produtosResponse = response.data.data;

                  if( produtosResponse.length > 0){
                  //  console.log(produtosResponse);
                      produtos  =  produtos.concat(produtosResponse);;
                    pagina++;
                  }else{
                    continuar = false;
                  }



        }catch(err){
            console.log("erro ao buscar produtos "+err)
            continuar = false;
        }


      }

       //console.log(produtos);

          for(let prod of produtos ){  
  
          const    id_bling = prod.id   
          const  codigo_sistema = parseInt(prod.codigo); 
          const     descricao  = prod.nome
            if( isNaN(codigo_sistema)){
              console.log('codigo invalido');
              continue;
            }

              const value = {
                  id_bling,codigo_sistema, descricao
              }


               console.log(value)
            
              await this.delay(2000);

                let produtoDoErp:any = [];
                try{
                  produtoDoErp = await produtoErp.buscaProduto(prod.codigo);
                }catch(err){
                }
                if( produtoDoErp.length > 0 ){

                  let descricaoSemAspas = this.formatDescricao(descricao);
                  const sql = ` INSERT INTO ${database_api}.produtos VALUES ('${id_bling}','${descricaoSemAspas}','${codigo_sistema}', '${dataInsercao}')
                  ON  DUPLICATE KEY UPDATE codigo_sistema = '${codigo_sistema}';
                  ` 
                  await conn_api.query(sql, (err:any, result)=>{
                      if(err){
              console.log(err);
                      }else{
                        console.log(result)
                      }
                  })
                }else{
                   console.log('produto nao encontrado no ERP cod: '+prod.codigo)
                  
                  }

  
      }

    }

}
