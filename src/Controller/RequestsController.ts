import { Request, Response } from "express";
import { RequestsBusiness } from "../Business/RequestsBusiness";

export class RequestsController {

    constructor(private requestBusiness: RequestsBusiness) { }

    public searchOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization  as string;
            const response = await this.requestBusiness.searchOrders(token);

            res.status(200).send(response);
        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public SendServiceOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization  as string;
            const orderData = req.body;
            const response = await this.requestBusiness.SendServiceOrder(token, orderData);

            res.status(200).send(response);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public async changeStatus(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization  as string;
            const { idPedido, newStatus } = req.body;
            const response = await this.requestBusiness.changeStatus(token, idPedido, newStatus);

            res.status(200).send(response);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }
    public cancelServiceOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization  as string;
            const idPedido = req.params.idPedido;
            const response = await this.requestBusiness.cancelServiceOrder(token, idPedido);

            res.status(200).send(response);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }
}