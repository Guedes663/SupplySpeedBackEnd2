import express from "express";
import { RequestsController } from "../Controller/RequestsController";
import { RequestsBusiness } from "../Business/RequestsBusiness";
import { RequestsData } from "../Data/RequestsData";

const requestsRoutes = express.Router();

const requestsData = new RequestsData();
const requestsBusiness = new RequestsBusiness(requestsData);
const requestsController = new RequestsController(requestsBusiness);

requestsRoutes.get("/search", requestsController.searchOrders);
requestsRoutes.post("/send", requestsController.SendServiceOrder);
requestsRoutes.put("/accept", requestsController.changeStatus);
requestsRoutes.delete("/cancel/:idPedido", requestsController.cancelServiceOrder);

export { requestsRoutes };