import express from "express";
import { RequestsController } from "../Controller/RequestsController";
import { RequestsBusiness } from "../Business/RequestsBusiness";
import { RequestsData } from "../Data/RequestsData";

const requestsRoutes = express.Router();

const requestsData = new RequestsData();
const requestsBusiness = new RequestsBusiness(requestsData);
const requestsController = new RequestsController(requestsBusiness);

requestsRoutes.get("/search", requestsController.searchOrders);
requestsRoutes.post("/send", requestsController.sendRequest);
requestsRoutes.put("/accept/:idPedido", requestsController.acceptRequest);
requestsRoutes.put("/reject/:idPedido", requestsController.rejectRequest);
requestsRoutes.put("/request/:idPedido", requestsController.requestDelivered);
requestsRoutes.delete("/cancel/:idPedido", requestsController.cancelRequest);

export { requestsRoutes };