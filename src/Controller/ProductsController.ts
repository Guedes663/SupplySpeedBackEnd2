import { Request, Response } from "express";
import { ProductBusiness } from "../Business/ProductsBusiness";

export class ProductsController {

    constructor(private productBusiness: ProductBusiness) {}

    public addProduct = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const productData = req.body;
            
            await this.productBusiness.addProduct(token, productData);
            
            res.status(200).send("Produto cadastrado!");
        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public editProduct = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const idProduct = req.params.idProduto;
            const productData = req.body;

            await this.productBusiness.editProduct(token, idProduct, productData);

            res.status(200).send();

        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public deleteProduct = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const idProduct =req.params.idProduto;
            
            await this.productBusiness.deleteProduct(token, idProduct);

            res.status(200).send();

        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }
}