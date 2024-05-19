import { Request, Response } from 'express';
import { UserBusiness } from '../Business/UserBusiness';
import { userRoutes } from '../routes/userRoutes';

export class UserController {

    constructor(private userBusiness: UserBusiness) {}

    public registerUser = async (req: Request, res: Response) => {
        try {
            const registrationData = req.body;
            const token = await this.userBusiness.registerUser(registrationData);
            
            res.status(200).send(token);

        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const loginData = req.body;
            const token = await this.userBusiness.login(loginData);

            res.status(200).send(token);
            
        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

}