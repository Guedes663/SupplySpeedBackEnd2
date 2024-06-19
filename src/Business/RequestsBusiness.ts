import { RequestsData } from "../Data/RequestsData";
import { CustomError } from "../utils/CustomError";
import { TokenUtils } from "../utils/TokenUtils";
import moment from 'moment';
import { uuidv7 as v7 } from '@kripod/uuidv7';
import { PedidoStatus } from "../types/statusType";

export class RequestsBusiness {

    constructor(private requestData: RequestsData) { }

    public searchOrders = async (token: string): Promise<any> => {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);
            const orderData = await this.requestData.searchOrders(tokenData);

            return orderData;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public SendServiceOrder = async (token: string, orderData: any): Promise<any> => {
        try {
            const { idDistribuidora, dataHora, arrayProdutos } = orderData;

            const response = await this.requestData.distributorCheck(idDistribuidora);

            if (response.length < 1) {
                throw new CustomError("Distribuidora não existe", 400);
            }

            if (response[0].tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("O id da distribuidora não é de uma distribuidora", 400);
            }

            for (let i = 0; i < arrayProdutos.length; i++) {

                const response2 = await this.requestData.checkProduct(arrayProdutos[i][0]);

                if (response2.length < 1) {
                    throw new CustomError("A distribuidora não possui esse produto", 400);
                }

                if (response2[0].idUsuario !== idDistribuidora) {
                    throw new CustomError("Esse produto não pertence a distribuidora", 400);
                }

            }

            const dateToValidate = moment(dataHora, 'DD/MM/YYYY_HH:mm');
            const isTodayOrAfter = dateToValidate.isValid() && dateToValidate.isSameOrAfter(moment().startOf('day'));

            if (!isTodayOrAfter || !dataHora) {
                throw new CustomError("A dataHora não foi passada ou não é válida", 400);
            }

            const tokenData = TokenUtils.getTokenInformation(token);

            if (tokenData.tipoUsuario.toLowerCase() !== "cliente") {
                throw new CustomError("O usuário não é um cliente, portanto não pode fazer um pedido a uma distribuidora", 400);
            }

            const idPedido = v7();
            await this.requestData.SendServiceOrder(idPedido, dataHora, idDistribuidora, tokenData.idUsuario, arrayProdutos);


        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public async changeStatus(token: string, idPedido: string, newStatus: PedidoStatus): Promise<string> {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);
    
            if (tokenData.tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("Somente distribuidoras podem mudar o status dos pedidos", 400);
            }
    
            const response = await this.requestData.checkRequest(idPedido);
    
            if (response.length < 1) {
                throw new CustomError("O pedido que você está tentando mudar o status não existe", 400);
            }
    
            if (response[0].statusPedido.toLowerCase() === PedidoStatus.Entregue && newStatus !== PedidoStatus.Entregue) {
                throw new CustomError("O pedido não pode ter seu status alterado depois de entregue", 400);
            }
    
            const response2 = await this.requestData.checkDistributorRequest(idPedido, tokenData.idUsuario);
    
            if (response2.length < 1) {
                throw new CustomError("O pedido não pertence a distribuidora", 400);
            }
    
            await this.requestData.changeStatus(idPedido, newStatus);
    
            return `Status de pedido foi mudado para '${newStatus}'`;
    
        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public cancelServiceOrder = async (token: string, idPedido: string): Promise<string> => {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);

            if (tokenData.tipoUsuario.toLowerCase() !== "cliente") {
                throw new CustomError("Somente clientes podem cancelar pedidos", 400);
            }

            const response = await this.requestData.checkRequest(idPedido);

            if (response.length < 1) {
                throw new CustomError("O pedido que você está tentando cancelar não existe", 400);
            }

            if (response[0].statusPedido.toLowerCase() === "entregue") {
                throw new CustomError("O pedido não pode ser cancelado depois de entregue", 400);
            }

            const response2 = await this.requestData.checkClientRequest(idPedido, tokenData.idUsuario);

            if (response2.length < 1) {
                throw new CustomError("O pedido não pertence ao cliente para ser cancelado", 400);
            }

            await this.requestData.cancelServiceOrder(idPedido);

            return "O pedido foi cancelado";



        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
}