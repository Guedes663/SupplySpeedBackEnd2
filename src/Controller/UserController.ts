import { Request, Response } from 'express';
import { UserBusiness } from '../Business/UserBusiness';

export class UserController {

    constructor(private userBusiness: UserBusiness) {}

    registerUser = async (req: Request, res: Response) => {
        try{
            const registrationData = req.body;
            
            
            res.status(200).send(registrationData);
        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

}