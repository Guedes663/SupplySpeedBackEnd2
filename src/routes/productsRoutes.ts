import express from "express";
import { ProductsController } from "../Controller/ProductsController";
import { ProductBusiness } from "../Business/ProductsBusiness";
import { productsData } from "../Data/ProductsData";

const productsRoutes = express.Router();

const productData = new productsData();
const productsBusiness = new ProductBusiness(productData);
const productsController = new ProductsController(productsBusiness);

productsRoutes.post("/addProduct", productsController.addProduct);
productsRoutes.put("/editProduct/:idProduto", productsController.editProduct);
productsRoutes.delete("/deleteProduct/:idProduto", productsController.deleteProduct);

export { productsRoutes };