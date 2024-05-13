import { response } from "express";
import { ProdutoModelo } from "../../models/produto/produtoModelo";
import { conn,db_publico } from "../../database/databaseConfig";
import { ProdutoBling } from "../../interfaces/produtoBling";
import { api } from "../../Services/api";

export class ProdutoController {
    async enviaProduto() {
        const produto = new ProdutoModelo();
        const produtos: any = await produto.buscaProduto(conn, db_publico);

        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        try {
            // Mapeia os produtos para uma array de Promises de envio
            const envioPromises = produtos.map(async (data: any) => {
                const aux: ProdutoBling = {
                    codigo: data.CODIGO,
                    nome: data.DESCRICAO,
                    descricaoCurta: data.DESCR_CURTA,
                    descricaoComplementar: data.DESCR_LONGA,
                    tipo: 'P',
                    unidade: 'un',
                    preco: 1,
                    pesoBruto: 1,
                    formato: 'S',
                    largura: data.LARGURA,
                    altura: data.ALTURA,
                    profundidade: data.COMPRIMENTO,
                    dimensoes: { altura: data.ALTURA, largura: data.LARGURA, profundidade: data.COMPRIMENTO },
                    tributacao: { cest: '', ncm: '' }
                };

                try {
                    const response = await api.post('/produtos', aux);
                    //console.log(response.data);
                    console.log(aux);
                } catch (error: any) {
                    if (error.response) {
                        console.log('Status:', error.response.status);
                        console.log('Data:', error.response.data.error);
                    }
                }
                await delay(9000);
            });

            // Espera todas as Promises de envio terminarem
            await Promise.all(envioPromises);

            // Se todas as Promises foram resolvidas (ou rejeitadas), imprime 'fim do envio'
            console.log('fim do envio');
        } catch (err) {
            console.log(err);
        }
    }
}