export interface clienteMercos{
	ultima_alteracao: string,
	razao_social: string,
	nome_fantasia: string,
	tipo: "J" | "F" ,
	cnpj: string,
	inscricao_estadual: string,
	suframa: string,
	rua: string,
	numero: string,
	complemento: string,
	cep: string,
	bairro: string,
	cidade: string,
	estado: string,
	observacao: string,
	excluido: boolean,
	bloqueado_b2b: boolean,
	bloqueado: boolean,
	criador_id: number,
	extras: any[]  | null  ,
	emails: [
		{
			tipo: string,
			email: string,
			id: number
		}
	] | null,
	 limite_credito : any[]  | null  ,
	 telefones : [
		{
			 tipo : "T" | any,
			 numero : string,
			 id : number
		} 
	]  | null   ,
	 id : number,
	 contatos : any[]  | null  , 
	 nome_excecao_fiscal : string,
	 enderecos_adicionais : any[]  | null  
}