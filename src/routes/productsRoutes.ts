import express from "express";
import { ProductsController } from "../Controller/ProductsController";
import { ProductBusiness } from "../Business/ProductsBusiness";
import { productsData } from "../Data/ProductsData";

const productsRoutes = express.Router();

const productData = new productsData();
const productsBusiness = new ProductBusiness(productData);
const productsController = new ProductsController(productsBusiness);

productsRoutes.post("/addProduct", productsController.addProduct);
productsRoutes.put("/editProduct", productsController.editProduct);
productsRoutes.delete("/deleteProduct", productsController.deleteProduct);

export { productsRoutes };