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
}


interface dimensoes{
    largura:number,
    altura:number,
    profundidade:number,
}
interface tributacao{
    ncm:string,
    cest:string
}
interface categoria{

}