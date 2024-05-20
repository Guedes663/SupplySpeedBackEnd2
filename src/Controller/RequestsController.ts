import { Request, Response } from "express";
import { RequestsBusiness } from "../Business/RequestsBusiness";

export class RequestsController {
    
    constructor(private productBusiness: RequestsBusiness) {}

    public searchOrders = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            const response = await this.productBusiness.searchOrders(token);

            res.status(200).send(response);
        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

}