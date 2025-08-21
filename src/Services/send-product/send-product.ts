import { IProdutoMercos } from "../../interfaces/IProduto-mercos";
import { api } from "../api/api";


export class SendProduct{
   
    private delay(ms: number) {
        console.log(`Aguardando ${ms / 1000} segundos...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async post(produto:IProdutoMercos){
       await this.delay(2000 );
      
      while( true ){

        try{
            let result = await api.post('/v1/produtos', produto);
                if( result.status === 201 || result.status === 200 ){
                return { 
                    id:result.headers.meuspedidosid,
                    status:200,
                    msg: `Produto ${produto.codigo } registrado com sucesso !`
                 }
                }
            }catch(e:any){
                if( e.response.status === 400 ){
                    console.log(e.response.data)
                    return { 
                        status:400,
                        msg: ` Ocorreu um erro ao tentar enviar o produto  Codigo: ${produto.codigo } `
                    }
                }
                    if( e.response.status === 412 ){
                    console.log(e.response.data)
                    let msg =` Erro ao tentar atualizar produto ${produto.codigo} `;
                    if(e.response.data.erros.isArray() ) {
                        msg = e.response.data.erros.toString()
                    }
                    return { 
                        status: 412,
                        msg: msg 
                    }
                }
                if(e.response.status === 429 ) {
                    console.log(e.response.data)
                     let tempoPermissao = e.response.data.tempo_ate_permitir_novamente  * 100;
                    await this.delay(tempoPermissao);
                }
            }          
      }

         
    } 
    
    async put(produto:IProdutoMercos, id:number ){
       await this.delay(2000 );
      
      while( true ){

        try{
            let result = await api.put(`/v1/produtos/${id}`, produto);
                if( result.status === 201 || result.status === 200 ){
                return { 
                    id:result.headers.meuspedidosid,
                    status:200,
                    msg: `Produto ${produto.codigo } atualizado com sucesso !`
                 }
                }
            }catch(e:any){
                if( e.response.status === 400 ){
                    console.log(e.response.data)
                    return { 
                        status:400,
                        msg: ` Ocorreu um erro ao tentar atualizar o produto  Codigo: ${produto.codigo } `
                    }
                }
                if( e.response.status === 412 ){
                    console.log(e.response.data)
                    let msg =` Erro ao tentar atualizar produto ${produto.codigo} `;
                    if(e.response.data.erros.isArray() ) {
                        msg = e.response.data.erros.toString()
                    }
                    return { 
                        status: 412,
                        msg: msg 
                    }
                }

                if(e.response.status === 429 ) {
                    console.log(e.response.data)
                     let tempoPermissao = e.response.data.tempo_ate_permitir_novamente  * 100;
                    await this.delay(tempoPermissao);
                }
            }          
      }

         
    } 
    

    
    
}