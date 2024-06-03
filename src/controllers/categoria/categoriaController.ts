import ConfigApi from "../../Services/api";
import { categoriaApi } from "../../models/categoriaApi/categoriaApi"; 
import { categoriaErp } from "../../models/categoriaErp/categoriaErp";

export class categoriaController{



    async validaCatedoria( value:any ){
        const  api:any = new ConfigApi();

            const categoriaSistema = new categoriaErp();
            const categoriaAPI = new categoriaApi();
           
            let categoria:any= [];
            categoria = await categoriaAPI.buscaCategoriaApi(value);

                let id_bling = null;
                let codigo_sistema = null;
                let descricao = null;

                    if(categoria.length > 0 ){
                        console.log('categoria ja esta cadastrada')
                        id_bling = categoria[0].Id_bling;
                    }else{
                            const cadastroSistema:any = await  categoriaSistema.buscaGrupo(value);
                           // console.log(cadastroSistema)
                            if(cadastroSistema.length > 0 ){
                                await api.configurarApi(); // Aguarda a configuração da API
                                
                                codigo_sistema = cadastroSistema[0].CODIGO; 
                                descricao = cadastroSistema[0].NOME
                                const data = {
                                "descricao": descricao,
                                "categoriaPai": {
                                  "id": 0
                                        }
                                    }
                                //    console.log(data);
                                try{
                                      const responseBling = await api.config.post('/categorias/produtos', data);
                                   // console.log(responseBling.data.data)
                                     id_bling = responseBling.data.data.id;
                                 //   console.log(id_bling)

                                     const value = { id_bling, codigo_sistema , descricao} ;
 
                                     const cadastro = await   categoriaAPI.cadastraCategoriaApi(value);

                                 }catch(err){console.log('erro ao enviar categoria '+ err)}
                            }

                    }

                 return id_bling;

    }
}