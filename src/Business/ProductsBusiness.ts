import { productsData } from "../Data/ProductsData";
import { TokenData } from "../models/Token";
import { CustomError } from "../utils/CustomError";
import { TokenUtils } from "../utils/TokenUtils";
import { v4 } from "uuid";

export class ProductBusiness {

    constructor(private productData: productsData) {}

    addProduct = async (token: any, productData: any) => {
        try {
            const { descricao, valorUnidade, nomeComercial, nomeTecnico, peso, material, dimensoes, fabricante } = productData;

            if( !descricao || !valorUnidade || !nomeComercial || !nomeTecnico || !peso || !material || !dimensoes || !fabricante ) {
                throw new CustomError("'descricao', 'valorUnidade', 'nomeComercial', 'nomeTecnico', 'peso', 'material', 'dimensoes' ou 'fabricante' está faltando", 400);
            }

            const tokenData: TokenData = TokenUtils.getTokenInformation(token);

            if( !tokenData ) {
                throw new CustomError("Token inválido", 400);
            }

            if( tokenData.tipoUsuario !== "distribuidora") {
                throw new CustomError("Usuário não tem permissão para adicionar produto", 403);
            }

            const idProduct = v4();
            await this.productData.addProduct(productData, tokenData.idUsuario, idProduct);

        } catch(err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    editProduct = async () => {
        try {
            
        } catch(err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    deleteProduct = async () => {
        try {
            
        } catch(err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

}