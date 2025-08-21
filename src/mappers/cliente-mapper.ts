import { ICad_clie } from "../interfaces/ICad_clie";
import { clienteMercos } from "../interfaces/ICliente-mercos";
import { DateService } from "../Services/dateService/date-service";



    export class ClienteMapper{

   private dateService = new DateService()


     private formatCpf(cpf: string): string {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length === 11) {
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (cpf.length === 14) {
            return cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');

        } else {
            throw new Error('CPF inválido');
        }
    }

   private formatCep( cep:string): string{
        cep = cep.replace(/\D/g, '');
        if( cep.length === 8  ){
            return cep.replace(/(\d{5})(\d{3})/,'$1-$2'); 
        }else{
            throw new Error('cep invalido')
        }
    }


  private  formatTelefone( telefone:string ){
      telefone= telefone.replace(/\D/g, '');
    if( telefone.length === 10 ){
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/ ,'($1) $2-$3');
      } 
  }



      cad_clieMapper(cliente:clienteMercos){

        let telefone = '(00) 00000-0000';
         if( cliente.telefones &&  Array.isArray( cliente.telefones) && cliente.telefones.length > 0  ){
            telefone = cliente.telefones[0].numero  
         }

        let contribuinte = 'N' 

        if( cliente.nome_excecao_fiscal   ){
            contribuinte = 'S'
        }

        let getClient:ICad_clie = { 
            nome : cliente.razao_social,
            apelido: cliente.nome_fantasia,
            fis_jur: cliente.tipo.toUpperCase(),
            cpf: this.formatCpf( cliente.cnpj),
            rg:  cliente.inscricao_estadual,
            email_fiscal : cliente.emails ? cliente.emails[0].email : '',
            email: cliente.emails ? cliente.emails[0].email : '',
            senha: '',
            observacoes: cliente.observacao,
            historico: '',
            bloq_motivo:'',
            obs_bancaria:'',
            obs_comercial1:'',
            obs_comercial2:'',
            obs_comercial3:'',
            obs_pessoal:'',
            endereco: cliente.rua,
            numero: cliente.numero,
            complemento: cliente.complemento === null ? '' : cliente.complemento,
            bairro: cliente.bairro,
            cidade: cliente.cidade,
            estado: cliente.estado,
            cep: this.formatCep(cliente.cep),
            telefone_res:  telefone  ,
            celular: telefone  ,
            data_cadastro: this.dateService.obterDataAtual(),
            consumidor_final: 'S',
            ativo: 'S',
            no_site: 'S',
            contrib:contribuinte,
            data_recad: cliente.ultima_alteracao
        }
            
return getClient;

    }
}