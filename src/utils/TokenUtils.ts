import * as jwt from "jsonwebtoken";
import { CustomError } from "./CustomError";

export class TokenUtils {

    public static generateToken(data: object): string {
        return jwt.sign(data, process.env.KEY_TOKEN, { expiresIn: '24h' });
    }

    public static getTokenInformation(token: string) {
        try {
            return jwt.verify(token, process.env.KEY_TOKEN);
        } catch (err: any) {
            throw new CustomError('Token inválido', 400);
        }
    }
}