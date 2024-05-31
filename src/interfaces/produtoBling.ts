export interface ProdutoBling{
    codigo:number,
    nome:string,
    descricaoCurta:string,
    descricaoComplementar:string,
    tipo:string,
    unidade:string,
    preco:number,
    pesoBruto:number,
    formato:string,
    largura:number,
    altura:number,
    profundidade:number,
    dimensoes:dimensoes,
    tributacao:tributacao,
    midia?:midia
}

interface midia{
    "imagens":{
        "externas":[
            { 
                link:any
            }
        ]
    }
}
interface dimensoes{
    largura:number,
    altura:number,
    profundidade:number,
}
interface tributacao{
    ncm:string | null,
    cest:string | null
}
interface categoria{

}