import express from "express";
import { ProductsController } from "../Controller/ProductsController";
import { ProductBusiness } from "../Business/ProductsBusiness";
import { productsData } from "../Data/ProductsData";

const productsRoutes = express.Router();

const productData = new productsData();
const productsBusiness = new ProductBusiness(productData);
const productsController = new ProductsController(productsBusiness);

productsRoutes.post("/add", productsController.addProduct);
productsRoutes.put("/edit/:idProduto", productsController.editProduct);
productsRoutes.delete("/delete/:idProduto", productsController.deleteProduct);

export { productsRoutes };