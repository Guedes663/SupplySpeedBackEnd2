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

            if (descricao && valorUnidade && nomeComercial && nomeTecnico && peso
                && material && dimensoes && fabricante && statusProduto) {
                await connection("produto")
                    .where({ idProduto })
                    .update({ descricao, valorUnidade, nomeComercial, nomeTecnico, peso, material, dimensoes, fabricante, statusProduto });
            }
            else {
                if (descricao) {
                    await connection("produto")
                        .where({ idProduto })
                        .update({ descricao });

                }
                if (valorUnidade) {
                    await connection("produto")
                        .where({ idProduto })
                        .update({ valorUnidade });

                }
                if (nomeComercial) {
                    await connection("produto")
                        .where({ idProduto })
                        .update({ nomeComercial });

                }
                if (nomeTecnico) {
                    await connection("produto")
                        .where({ idProduto })
                        .update({ nomeTecnico });

                }
                if (peso) {
                    await connection("produto")
                        .where({ idProduto })
                        .update({ peso });

                }
                if (material) {
                    await connection("produto")
                        .where({ idProduto })
                        .update({ material });

                }
                if (dimensoes) {
                    await connection("produto")
                        .where({ idProduto })
                        .update({ dimensoes });

                }
                if (fabricante) {
                    await connection("produto")
                        .where({ idProduto })
                        .update({ fabricante });

                }
                if(statusProduto) {
                    await connection("produto")
                        .where({ idProduto })
                        .update({ statusProduto });
                }
            }

        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}