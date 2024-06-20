import { productsData } from "../Data/ProductsData";
import { TokenData } from "../models/Token";
import { CustomError } from "../utils/CustomError";
import { TokenUtils } from "../utils/TokenUtils";
import { uuidv7 as v7 } from '@kripod/uuidv7';

export class ProductBusiness {

    constructor(private productData: productsData) {}

    public addProduct = async (token: any, productData: any) => {
        try {
            const { descricao, valorUnidade, nomeComercial, nomeTecnico, peso, material, dimensoes, fabricante } = productData;

            if( !descricao || !valorUnidade || !nomeComercial || !nomeTecnico || !peso || !material || !dimensoes || !fabricante ) {
                throw new CustomError("'descricao', 'valorUnidade', 'nomeComercial', 'nomeTecnico', 'peso', 'material', 'dimensoes' ou 'fabricante' está faltando", 400);
            }

            const tokenData: TokenData = TokenUtils.getTokenInformation(token);

            if( tokenData.tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("Usuário não tem permissão para adicionar produto", 403);
            }

            const idProduct = v7();
            await this.productData.addProduct(productData, tokenData.idUsuario, idProduct);

        } catch(err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public editProduct = async (token: any, idProduct: any, productData: any) => {
        try {
            const { descricao, valorUnidade, nomeComercial, nomeTecnico, peso, material, dimensoes, fabricante, statusProduto } = productData;

            if( !descricao && !valorUnidade && !nomeComercial && !nomeTecnico && !peso && !material && !dimensoes && !fabricante && !statusProduto ) {
                throw new CustomError("Nehnum dado foi recebido para alterar o produto", 400);
            }
        
            const tokenData: TokenData = TokenUtils.getTokenInformation(token);

            if( tokenData.tipoUsuario.toLowerCase() !== "distribuidora" ) {
                throw new CustomError("Usuário não é distribuidora", 403);
            }

            const queryResponse = await this.productData.productExists(idProduct);

            if( queryResponse.length < 1 ) {
                throw new CustomError("Produto não existe", 400);
            }

            const queryResponse2 = await this.productData.checkPermission(tokenData.idUsuario, idProduct);

            if( queryResponse2.length < 1 ) {
                throw new CustomError("Usuário não tem permissão para editar o produto", 400);
            }

            await this.productData.changeProduct(productData, idProduct);

            return "Produto modificado com sucesso!";

        } catch(err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public deleteProduct = async (token: any, idProduct: any) => {
        try {
            const tokenData: TokenData = TokenUtils.getTokenInformation(token);

            if( tokenData.tipoUsuario.toLowerCase() !== "distribuidora" ) {
                throw new CustomError("Usuário não é distribuidora", 403);
            }

            const queryResponse = await this.productData.productExists(idProduct);

            if( queryResponse.length < 1 ) {
                throw new CustomError("Produto não existe", 400);
            }

            const queryResponse2 = await this.productData.checkPermission(tokenData.idUsuario, idProduct);

            if( queryResponse2.length < 1 ) {
                throw new CustomError("Usuário não tem permissão para excluir o produto", 400);
            }

            await this.productData.deleteProduct(idProduct);
            
        } catch(err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

}