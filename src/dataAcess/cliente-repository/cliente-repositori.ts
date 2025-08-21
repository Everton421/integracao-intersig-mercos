import { conn, db_publico } from "../../database/databaseConfig"
import { ICad_clie } from "../../interfaces/ICad_clie";


type OkPacket = {
  fieldCount: number,
  affectedRows: number,
  insertId: number,
  serverStatus: number,
  warningCount: number,
  message: string,
  protocol41: boolean,
  changedRows: number
}


export class ClienteRepository {
    async buscaPorCnpj(cnpj: string) {
        const value = this.formatCpf(cnpj);

        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ${db_publico}.cad_clie WHERE CPF = ?`; // Usando um placeholder '?'
            conn.query(sql, [value], (err, result) => {
                if (err) {
                    reject(err);
                } else {    
                        resolve(result);
                }
            });
        });
    }

    async validaCadastro(cnpj: string) {
        const value = this.formatCpf(cnpj);
      
        return new Promise<boolean>( async (resolve, reject) => {
            const sql = `SELECT * FROM ${db_publico}.cad_clie WHERE CPF = ?`; // Usando um placeholder '?'
            await conn.query(sql, [value], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(false)
                } else {    
                    if(result.length > 0){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }
            });
        });
    }
    
    formatCpf(cpf: string): string {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length === 11) {
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (cpf.length === 14) {
            return cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else {
            throw new Error('CPF inválido');
        }
    }

    formatCep( cep:string): string{

        cep = cep.replace(/\D/g, '');

        if( cep.length === 8  ){
            return cep.replace(/(\d{5})(\d{3})/,'$1-$2'); 
        }else{
            throw new Error('cep invalido')
        }

}

formatCelular( celular:string ) :string{
    celular = celular.replace(/\D/g, '');

    if( celular.length === 11 ){
        return celular.replace(/(\d{2})(\d{5})(\d{4})/ , '($1) $2-$3');
    }else if( celular.length === 10 ){
        return celular.replace(/(\d{2})(\d{4})(\d{4})/ , '($1) $2-$3');
       }else{
        throw new Error('celular Invalido')
       }
    
}

formatTelefone( telefone:string ){
    telefone= telefone.replace(/\D/g, '');

if( telefone.length === 10 ){
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/ ,'($1) $2-$3');
}
}

 

async cadastrarClientErp(json: ICad_clie) :Promise< OkPacket >{

    const {
            nome,
            apelido,
            fis_jur,
            cpf,
            rg,
            contrib,
            email_fiscal,
            email,
            senha,
            observacoes,
            historico,
            bloq_motivo,
            obs_bancaria,
            obs_comercial1,
            obs_comercial2,
            obs_comercial3,
            obs_pessoal,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
            telefone_res,
            celular,
            data_cadastro,
            consumidor_final,
            ativo,
            no_site,
      
    } = json;

    
    
        return new Promise(async (resolve, reject) => {
        const sql = `
            INSERT INTO ${db_publico}.cad_clie (
                nome,
                apelido,
                fis_jur,
                cpf,
                rg,
                email_fiscal,
                email,
                senha,
                observacoes,
                historico,
                bloq_motivo,
                obs_bancaria,
                obs_comercial1,
                obs_comercial2,
                obs_comercial3,
                obs_pessoal,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
                telefone_res,
                celular,
                data_cadastro,
                consumidor_final,
                ativo,
                no_site
            ) VALUES (
                '${nome}',
                '${apelido}',
                '${fis_jur}',
                '${cpf}',
                '${rg}',
                '${email}',
                '${email}',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '${endereco}',
                '${numero}',
                '${complemento}',
                '${bairro}',
                '${cidade}',
                '${estado}',
                '${cep}',
                '${telefone_res}',
                '${celular}',
                '${data_cadastro}',
                'S',
                'S',
                'S'
            );
        `;

        await conn.query(sql, (err, result) => {
            if (err) {
                console.log("Erro ao tentar cadastrar o cliente no erp  ", err);
                reject(err);
            } else {
                console.log(result)
                resolve(result);
            }
        });
    });
}



async updateClientErp(cliente:ICad_clie, codigo:number ) :Promise<OkPacket>{

   return new Promise( async ( resolve, reject)=>{

        let conditions =[]
        let values =[]

        if( cliente.data_recad){
            conditions.push(' data_recad = ? ')
            values.push(cliente.data_recad)
            
        }
        if(cliente.data_cadastro){
            conditions.push(' data_cadastro = ? ')
            values.push(cliente.data_cadastro)
        }
         if(cliente.telefone_res){
            conditions.push(' telefone_res = ? ')
            values.push(cliente.telefone_res)
        }
        if(cliente.cep){
            conditions.push(' cep = ? ')
            values.push(cliente.cep)
        }
        if(cliente.estado){
            conditions.push(' estado = ? ')
            values.push(cliente.estado)
        }
        if(cliente.cidade){
            conditions.push(' cidade = ? ')
            values.push(cliente.cidade)
        }
        if(cliente.bairro){
            conditions.push(' bairro = ? ')
            values.push(cliente.bairro)
        }
        if(cliente.complemento){
            conditions.push(' complemento = ? ')
            values.push(cliente.complemento)
        }
        if(cliente.numero){
            conditions.push(' numero = ? ')
            values.push(cliente.numero)
        }
        if( cliente.endereco){
            conditions.push(' celular = ? ')
            values.push(cliente.celular)
        }
        if( cliente.nome){
            conditions.push( ' nome = ? ')
            values.push(cliente.nome)
        }
        if( cliente.apelido){
            conditions.push(' apelido = ? ');
            values.push(cliente.apelido);
        }
        if( cliente.fis_jur){
            conditions.push( ' fis_jur = ? ' )
            values.push(cliente.fis_jur);
        }
        if(cliente.cpf){
             conditions.push( ' cpf = ? ' )
            values.push(cliente.cpf);
        }
        if( cliente.rg){
             conditions.push( ' rg = ? ' )
            values.push(cliente.rg);
        }
        if(cliente.email_fiscal){
            conditions.push( ' email_fiscal = ? ');
            values.push(cliente.email_fiscal );
        }
        if(cliente.email){
            conditions.push( ' email = ? ');
            values.push(cliente.email );
        }

                let sql = ` UPDATE ${db_publico}.cad_clie set ` 
                let whereClause = ' WHERE codigo = ? '
                values.push( codigo );

            let finalSql = sql;
                if( conditions.length > 0 ) {   
                    finalSql = sql + conditions.join( ' , ') + whereClause;
            }

                await conn.query(finalSql, values ,( err, result )=>{
                    if( err ){
                        console.log("Erro ao tentar atualizar o cliente ")
                        reject(err);
                    }else{
                        console.log(result);
                        resolve(result);
                    }   
                })
   })
             
        

}



}