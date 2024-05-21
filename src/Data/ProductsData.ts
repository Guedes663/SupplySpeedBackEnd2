import connection from "./connection";

export class productsData {
    addProduct = async (productData: any, idUsuario: any, idProduto: any) => {
        try {
            const { descricao, valorUnidade, nomeComercial, nomeTecnico, peso, material, dimensoes, fabricante } = productData;

            await connection("produto").insert({
                idProduto,
                descricao,
                valorUnidade,
                nomeComercial,
                nomeTecnico,
                peso,
                material,
                dimensoes,
                fabricante
            });

            await connection("usuario_produto").insert({
                idUsuario,
                idProduto
            });

        } catch(err: any) {
            throw new Error(err.message);
        }
    }
}