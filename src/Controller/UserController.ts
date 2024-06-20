import { Request, Response } from 'express';
import { UserBusiness } from '../Business/UserBusiness';

export class UserController {

    constructor(private userBusiness: UserBusiness) { }

    public registerUser = async (req: Request, res: Response) => {
        try {
            const registrationData = req.body;
            const token = await this.userBusiness.registerUser(registrationData);

            res.status(201).send(token);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const loginData = req.body;
            const token = await this.userBusiness.login(loginData);

            res.status(200).send(token);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public searchInformation = async (req: Request, res: Response) => {
        try {
            const numPage = req.params.numPage;
            const token = req.headers.authorization;
            const users = await this.userBusiness.searchInformation(numPage, token);


            res.status(200).send(users);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }

    public getProfileInformation = async (req: Request, res: Response) => {
        try {
            const idProfile = req.params.idProfile;
            const token = req.headers.authorization;
            const response = await this.userBusiness.getProfileInformation(token, idProfile);


            res.status(200).send(response);

        } catch (err: any) {
            res.status(err.statusCode || 500).send(err.message);
        }
    }
}