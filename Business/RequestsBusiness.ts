import { RequestsData } from "../Data/RequestsData";
import { CustomError } from "../utils/CustomError";
import { TokenUtils } from "../utils/TokenUtils";
import moment from 'moment';
import { uuidv7 } from '@kripod/uuidv7';
import { PedidoStatus } from "../types/statusType";
import { TokenData } from "../types/Token";
import { TipoUsuario } from "../types/UserType";

export class RequestsBusiness {
    constructor(private requestData: RequestsData) { 
            this.requestData = requestData;
    
    }

    public searchOrders = async (token: string): Promise<any> => {
        try {
            const tokenData: TokenData = TokenUtils.getTokenInformation(token);
            const orderData = await this.requestData.searchOrders(tokenData);
            return orderData;
        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public SendServiceOrder = async (token: string, orderData: any): Promise<void> => {
        try {
            const { idDistribuidora, dataHora, arrayProdutos } = orderData;

            const response = await this.requestData.distributorCheck(idDistribuidora);

            if (response.length < 1) {
                throw new CustomError("Distribuidora não existe", 404);
            }

            if (response[0].tipoUsuario.toLowerCase() !== TipoUsuario.DISTRIBUIDORA) {
                throw new CustomError("O usuário precisa ser uma distribuidora", 403);
            }

            for (let i = 0; i < arrayProdutos.length; i++) {
                const response2 = await this.requestData.checkProduct(arrayProdutos[i][0]);
                if (response2.length < 1) {
                    throw new CustomError("A distribuidora não possui esse produto", 404);
                }
                if (response2[0].idUsuario !== idDistribuidora) {
                    throw new CustomError("Esse produto não pertence a distribuidora", 404);
                }
            }

            const dateToValidate = moment(dataHora, 'DD/MM/YYYY_HH:mm');
            const isTodayOrAfter = dateToValidate.isValid() && dateToValidate.isSameOrAfter(moment().startOf('day'));

            if (!isTodayOrAfter || !dataHora) {
                throw new CustomError("A data e a hora fornecidas são inválidas", 422);
            }

            const tokenData = TokenUtils.getTokenInformation(token);

            if (tokenData.tipoUsuario.toLowerCase() !== TipoUsuario.CLIENTE) {
                throw new CustomError("Apenas clientes podem fazer pedidos", 403);
            }

            const idPedido = uuidv7();
            await this.requestData.SendServiceOrder(idPedido, dataHora, idDistribuidora, tokenData.idUsuario, arrayProdutos);
        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public async changeStatus(token: string, idPedido: string, newStatus:string ): Promise<string> {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);

            if (tokenData.tipoUsuario.toLowerCase() !== TipoUsuario.DISTRIBUIDORA) {
                throw new CustomError("Somente distribuidoras podem aceitar pedidos", 403);
            }

            const response = await this.requestData.checkRequest(idPedido);

            if (response.length < 1) {
                throw new CustomError("O pedido que você está tentando aceitar não existe", 404);
            }

            if (response[0].statusPedido.toLowerCase() === PedidoStatus.Entregue && newStatus !== PedidoStatus.Entregue) {
                throw new CustomError("O pedido não pode ser aceito depois de entregue", 400);
            }

            const response2 = await this.requestData.checkDistributorRequest(idPedido, tokenData.idUsuario);

            if (response2.length < 1) {
                throw new CustomError("O pedido não pertence a distribuidora", 403);
            }

            await this.requestData.changeStatus(idPedido, newStatus);

            return `Status de pedido foi mudado para '${newStatus}'`;
        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode || 500);
        }
    }




    public cancelServiceOrder = async (token: string, idPedido: string): Promise<string> => {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);

            if (tokenData.tipoUsuario.toLowerCase() !== TipoUsuario.CLIENTE) {
                throw new CustomError("Somente clientes podem cancelar pedidos", 403);
            }

            const response = await this.requestData.checkRequest(idPedido);

            if (response.length < 1) {
                throw new CustomError("O pedido que você está tentando cancelar não existe", 404);
            }

            if (response[0].statusPedido.toLowerCase() === "entregue") {
                throw new CustomError("O pedido não pode ser cancelado depois de entregue", 400);
            }

            const response2 = await this.requestData.checkClientRequest(idPedido, tokenData.idUsuario);

            if (response2.length < 1) {
                throw new CustomError("O pedido não pertence ao cliente para ser cancelado", 403);
            }

            await this.requestData.cancelServiceOrder(idPedido);

            return "O pedido foi cancelado";
        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
}