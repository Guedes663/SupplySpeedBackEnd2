import { RequestsData } from "../Data/RequestsData";
import { CustomError } from "../utils/CustomError";
import { TokenUtils } from "../utils/TokenUtils";
import moment from 'moment';
import { v4 } from "uuid";

export class RequestsBusiness {

    constructor(private requestData: RequestsData) { }

    public searchOrders = async (token: any) => {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);
            const orderData = await this.requestData.searchOrders(tokenData);

            return orderData;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public sendRequest = async (token: any, orderData: any) => {
        try {
            const { idDistribuidora, dataHora, idEndereco, arrayProdutos } = orderData;

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

            const dateToValidate = moment(dataHora);
            const today = moment().startOf('day');

            const isTodayOrAfter = dateToValidate.isSameOrAfter(today, 'day');

            if (!isTodayOrAfter) {
                throw new CustomError("A data passada não é válida", 400);
            }

            const response3 = await this.requestData.checkAddress(idEndereco);

            if (response3.length < 1) {
                throw new CustomError("O endereço passado não existe", 400);
            }

            const tokenData = TokenUtils.getTokenInformation(token);

            if (tokenData.tipoUsuario.toLowerCase() !== "cliente") {
                throw new CustomError("O usuário não é um cliente, portanto não pode fazer um pedido a uma distribuidora", 400);
            }

            const idPedido = v4();
            await this.requestData.sendRequest(idPedido, dataHora, idEndereco, idDistribuidora, tokenData.idUsuario, arrayProdutos);

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public acceptRequest = async (token: any, idPedido: any) => {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);

            if (tokenData.tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("Somente distribuidoras podem aceitar pedidos", 400);
            }

            const response = await this.requestData.checkRequest(idPedido);

            if (response.length < 1) {
                throw new CustomError("O pedido que você está tentando aceitar não existe", 400);
            }

            if (response[0].statusPedido.toLowerCase() === "entregue") {
                throw new CustomError("O pedido não pode ser aceito depois de entrega-lo", 400);
            }

            const response2 = await this.requestData.checkDistributorRequest(idPedido, tokenData.idUsuario);

            if (response2.length < 1) {
                throw new CustomError("O pedido não pertence a distribuidora", 400);
            }

            await this.requestData.changesStatusAccepted(idPedido);

            return "Status de pedido foi mudado para 'Aceito'";

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public rejectRequest = async (token: any, idPedido: any) => {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);

            if (tokenData.tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("Somente distribuidoras podem rejeitar pedidos", 400);
            }

            const response = await this.requestData.checkRequest(idPedido);

            if (response.length < 1) {
                throw new CustomError("O pedido que você está tentando rejeitar não existe", 400);
            }

            if (response[0].statusPedido.toLowerCase() === "entregue") {
                throw new CustomError("O pedido não pode ser rejeitado depois de entrega-lo", 400);
            }

            const response2 = await this.requestData.checkDistributorRequest(idPedido, tokenData.idUsuario);

            if (response2.length < 1) {
                throw new CustomError("O pedido não pertence a distribuidora", 400);
            }

            await this.requestData.changesStatusRejected(idPedido);

            return "Status de pedido foi mudado para 'Rejeitado'";



        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public requestDelivered = async (token: any, idPedido: any) => {
        try {
            const tokenData = TokenUtils.getTokenInformation(token);

            if (tokenData.tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("Somente distribuidoras podem entregar pedidos", 400);
            }

            const response = await this.requestData.checkRequest(idPedido);

            if (response.length < 1) {
                throw new CustomError("O pedido que você está tentando mudar o status para entregue não existe", 400);
            }

            if (response[0].statusPedido.toLowerCase() === "entregue") {
                throw new CustomError("O pedido que você está tentando mudar o status para entregue já possui esse status", 400);
            }

            const response2 = await this.requestData.checkDistributorRequest(idPedido, tokenData.idUsuario);

            if (response2.length < 1) {
                throw new CustomError("O pedido não pertence a distribuidora", 400);
            }

            await this.requestData.changesStatusDelivered(idPedido);

            return "Status de pedido foi mudado para 'Entregue'";



        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public cancelRequest = async (token: any, idPedido: any) => {
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

            await this.requestData.cancelRequest(idPedido);

            return "O pedido foi cancelado";



        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
}