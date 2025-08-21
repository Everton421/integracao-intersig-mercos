import { conn, db_publico } from "../../database/databaseConfig"

type Ipi =  { CODIGO:number, DESCRICAO:string, IPI:number};
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
export class IpiRepository{
    
    async findByProduct(codigo:number):Promise<Ipi[]>{

        return new Promise( async ( resolve, reject ) =>{

            let sql = ` 
                  SELECT 
                       p.CODIGO , 
                      p.DESCRICAO, 
                      if(isnull(r.ALIQ_VAL_IPI),0, r.ALIQ_VAL_IPI) IPI 
               FROM 
                  ${db_publico}.cad_prod p
                 LEFT JOIN ${db_publico}.itens_regra_ipi_ii i ON i.tipo = 'P' AND i.cod_item = p.codigo
                  LEFT OUTER JOIN ${db_publico}.regras_ipi_ii r ON r.codigo = i.regra AND r.subaplic_prod = 'P' AND r.tipo_trans = 'V'
                  WHERE p.CODIGO   =  ?
                  GROUP BY p.CODIGO
                  ORDER BY p.CODIGO
            `
            await conn.query( sql, codigo, ( err, result: Ipi[]   )=>{
                if( err){
                    reject(err)
                }else{
                    resolve(result);
                }
            })

        })  
    }
}