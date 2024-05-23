import { Request, Response } from "express";
import { RequestsBusiness } from "../Business/RequestsBusiness";

export class RequestsController {

    constructor(private requestBusiness: RequestsBusiness) { }

    public searchOrders = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const response = await this.requestBusiness.searchOrders(token);

            res.status(200).send(response);
        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public sendRequest = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const orderData = req.body;
            const response = await this.requestBusiness.sendRequest(token, orderData);

            res.status(200).send(response);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public acceptRequest = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const idPedido = req.params.idPedido;
            const response = await this.requestBusiness.acceptRequest(token, idPedido);

            res.status(200).send(response);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public rejectRequest = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const idPedido = req.params.idPedido;
            const response = await this.requestBusiness.rejectRequest(token, idPedido);

            res.status(200).send(response);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public requestDelivered = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const idPedido = req.params.idPedido;
            const response = await this.requestBusiness.requestDelivered(token, idPedido);

            res.status(200).send(response);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public cancelRequest = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const idPedido = req.params.idPedido;
            const response = await this.requestBusiness.cancelRequest(token, idPedido);

            res.status(200).send(response);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }
}