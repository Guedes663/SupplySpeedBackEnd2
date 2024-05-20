import express from "express";
import { RequestsController } from "../Controller/RequestsController";
import { RequestsBusiness } from "../Business/RequestsBusiness";
import { RequestsData } from "../Data/RequestsData";

const requestsRoutes = express.Router();

const requestsData = new RequestsData();
const requestsBusiness = new RequestsBusiness(requestsData);
const requestsController = new RequestsController(requestsBusiness);

requestsRoutes.post("/searchOrders/", requestsController.searchOrders);

export { requestsRoutes };