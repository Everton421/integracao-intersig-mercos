import { CategoriaApiRepository } from "../../dataAcess/api-categoria-repository/categoria-api-repository";
import { CategoriaRepository } from "../../dataAcess/categoria-repository/categoria-repository";
import { api } from "../api/api";

export class SyncCategory{

    private categoryRepository = new CategoriaRepository()
    private categoryApiRepository = new CategoriaApiRepository()



 
    async postCategory(codigo_sistema:number ){   

        const arrValidCategory = await this.categoryApiRepository.findByCodeSystem(codigo_sistema)

        const arrSystemCategory = await this.categoryRepository.buscaGrupo(codigo_sistema)

        if( arrValidCategory.length > 0 ){
            const validCategory = arrValidCategory[0]
            const systemCategory = arrSystemCategory[0] 

               if( new Date( systemCategory.DATA_RECADASTRO ) > new Date( validCategory.data_envio ) ){
                //atualizar 
                    try{
                        const resultPutCategory = await api.put(`/v1/categorias/${validCategory.Id}`);
                            if(resultPutCategory.status === 200 || resultPutCategory.status === 201 ){
                                //await this.categoryApiRepository.
                            }
                    }catch(e){

                    }
                }    

          }else{


          }

    }
}