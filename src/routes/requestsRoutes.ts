import express from "express";
import { RequestsController } from "../Controller/RequestsController";
import { RequestsBusiness } from "../Business/RequestsBusiness";
import { RequestsData } from "../Data/RequestsData";

const requestsRoutes = express.Router();

const requestsData = new RequestsData();
const requestsBusiness = new RequestsBusiness(requestsData);
const requestsController = new RequestsController(requestsBusiness);

requestsRoutes.get("/searchOrders", requestsController.searchOrders);
requestsRoutes.post("/sendRequest", requestsController.sendRequest);
requestsRoutes.put("/acceptRequest/:idPedido", requestsController.acceptRequest);
requestsRoutes.put("/rejectRequest/:idPedido", requestsController.rejectRequest);
requestsRoutes.put("/requestDelivered/:idPedido", requestsController.requestDelivered);
requestsRoutes.delete("/cancelRequest/:idPedido", requestsController.cancelRequest);

export { requestsRoutes };