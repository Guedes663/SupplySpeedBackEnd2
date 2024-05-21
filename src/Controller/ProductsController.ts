import { Request, Response } from "express";
import { ProductBusiness } from "../Business/ProductsBusiness";

export class ProductsController {

    constructor(private productBusiness: ProductBusiness) {}

    addProduct = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const productData = req.body;
            await this.productBusiness.addProduct(token, productData);
            
            res.status(200).send("Produto cadastrado!");
        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    editProduct = async (req: Request, res: Response) => {
        try {

        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    deleteProduct = async (req: Request, res: Response) => {
        try {

        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }
}