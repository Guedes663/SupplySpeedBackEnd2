import { ProductModel } from "../models/productModel";
import { CustomError } from "../utils/CustomError";
import connection from "./connection";

export class productsData {
    public addProduct = async (productData: ProductModel , idUsuario: string, idProduto: string) => {
        try {
             
            await connection("produto").insert({
                productData,
                idProduto
            });

            await connection("usuario_produto").insert({
                idUsuario,
                idProduto
            });

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public checkPermission = async (idUsuario: string, idProduto: string) => {
        try {
            const queryResponse = await connection("usuario_produto")
                .select("*")
                .where({ idUsuario, idProduto });

            return queryResponse;
        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public productExists = async (idProduto: string) => {
        try {
            const queryResponse = await connection("produto")
                .select("statusProduto")
                .where({ idProduto });

            return queryResponse;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public deleteProduct = async (idProduto: string) => {
        try {
            await connection("produto")
                .where({ idProduto })
                .update({ statusProduto: 0 });


        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
    public changeProduct = async (productData: ProductModel, idProduto: string) => {
        try {
            await connection("produto")
                .where({ idProduto })
                .update({productData });

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
}