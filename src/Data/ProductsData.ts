import connection from "./connection";

export class productsData {
    public addProduct = async (productData: any, idUsuario: any, idProduto: any) => {
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

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public checkPermission = async (idUsuario: any, idProduto: any) => {
        try {
            const queryResponse = await connection("usuario_produto")
                .select("*")
                .where({ idUsuario, idProduto });

            return queryResponse;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public productExists = async (idProduto: any) => {
        try {
            const queryResponse = await connection("produto")
                .select("statusProduto")
                .where({ idProduto });

            return queryResponse;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public deleteProduct = async (idProduto: any) => {
        try {
            await connection("produto")
                .where({ idProduto })
                .update({ statusProduto: 0 });


        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    public changeProduct = async (productData: any, idProduto: any) => {
        try {
            const { descricao, valorUnidade, nomeComercial, nomeTecnico, peso, material, dimensoes, fabricante, statusProduto } = productData;

            await connection("produto")
                .where({ idProduto })
                .update({ descricao, valorUnidade, nomeComercial, nomeTecnico, peso, material, dimensoes, fabricante, statusProduto });

        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}