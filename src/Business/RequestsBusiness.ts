import { RequestsData } from "../Data/RequestsData";
import { CustomError } from "../utils/CustomError";
import { TokenUtils } from "../utils/TokenUtils";

export class RequestsBusiness {

    constructor(private productData: RequestsData) {}

    public searchOrders = async (token: any) => {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);
            const orderData = await this.productData.searchOrders(tokenData);
            
            return orderData;

        } catch(err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

}