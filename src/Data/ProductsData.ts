import { ProductModel } from "../models/productModel";
import connection from "./connection";

export class productsData {
    public addProduct = async (productData: ProductModel , idUsuario: string, idProduto: string) => {
        try {
             
            await connection("produto").insert({
                productData
            });

            await connection("usuario_produto").insert({
                idUsuario,
                idProduto
            });

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public checkPermission = async (idUsuario: string, idProduto: string) => {
        try {
            const queryResponse = await connection("usuario_produto")
                .select("*")
                .where({ idUsuario, idProduto });

            return queryResponse;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public productExists = async (idProduto: string) => {
        try {
            const queryResponse = await connection("produto")
                .select("statusProduto")
                .where({ idProduto });

            return queryResponse;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public deleteProduct = async (idProduto: string) => {
        try {
            await connection("produto")
                .where({ idProduto })
                .update({ statusProduto: 0 });


        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    public changeProduct = async (productData: any, idProduto: string) => {
        try {
            await connection("produto")
                .where({ idProduto })
                .update({productData });

        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}