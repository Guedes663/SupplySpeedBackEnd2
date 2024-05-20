import { Request, Response } from 'express';
import { UserBusiness } from '../Business/UserBusiness';

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

    public searchUsers = async (req: Request, res: Response) => {
        try {
            const numPage = req.params.numPage;
            const token = req.params.token;
            const users = await this.userBusiness.searchUsers(numPage, token);


            res.status(200).send(users);
            
        } catch(err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }
}