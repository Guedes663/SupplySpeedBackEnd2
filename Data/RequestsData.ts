import connection from "./connection";
import { UsuarioModelo } from '../models/UserModel';
import { PedidoModel } from "../models/OrderModel";
import { ProductModel } from "../models/productModel";
import { CustomError } from "../utils/CustomError";
import { TipoUsuario } from "../types/UserType";

export class RequestsData {

    public searchOrders = async (userData: any) => {
        try {
            let UsuarioModelo: UsuarioModelo
            let pedidoModel: PedidoModel
            let productModel: ProductModel
            let query = connection("usuario_pedido")
                .select(
                    UsuarioModelo,
                    pedidoModel,
                    productModel   
                )
                .innerJoin("usuario", function() {
                    if (userData.tipoUsuario.toLowerCase() === TipoUsuario.CLIENTE) {
                        this.on("usuario_pedido.idUsuarioDestinatario", "=", "usuario.idUsuario");
                    } else {
                        this.on("usuario_pedido.idUsuarioRemetente", "=", "usuario.idUsuario");
                    }
                })
                .innerJoin("pedido", "usuario_pedido.idPedido", "=", "pedido.idPedido")
                .innerJoin("pedido_produto", "pedido.idPedido", "=", "pedido_produto.idPedido")
                .innerJoin("produto", "pedido_produto.idProduto", "=", "produto.idProduto");
    
            if (userData.tipoUsuario.toLowerCase() === TipoUsuario.CLIENTE) {
                query.where("usuario_pedido.idUsuarioRemetente", userData.idUsuario);
            } else {
                query.where("usuario_pedido.idUsuarioDestinatario", userData.idUsuario);
            }
    
            const orders = await query;
    
            return orders;
        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
    public distributorCheck = async (idUsuario: string) => {
        try {
            const response = await connection("usuario")
                .select("tipoUsuario")
                .where({ idUsuario });

            return response;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public checkProduct = async (idProduto: string) => {
        try {
            const response = await connection("usuario_produto")
                .select("idUsuario")
                .where({ idProduto });

            return response;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public checkAddress = async (idEndereco: string) => {
        try {
            const response = await connection("endereco")
                .select("idEndereco")
                .where({ idEndereco });

            return response;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public SendServiceOrder = async (idPedido: string, dataHora: Date,  idDistribuidora: string, idCliente: string, arrayProdutos: (string | number)[][]) => {
        try {
            await connection("pedido")
                .insert({
                    idPedido,
                    statusPedido: "Em análise",
                    dataHora
               
                });

            await connection("usuario_pedido")
                .insert({
                    idUsuarioRemetente: idCliente,
                    idUsuarioDestinatario: idDistribuidora,
                    idPedido
                });

            for (let i = 0; i < arrayProdutos.length; i++) {
                await connection("pedido_produto")
                    .insert({
                        idPedido,
                        idProduto: arrayProdutos[i][0],
                        quantidade: arrayProdutos[i][1]
                    });
            }

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public checkRequest = async (idPedido: string) => {
        try {
            const response = await connection("pedido")
                .select("*")
                .where({ idPedido });

            return response;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public checkDistributorRequest = async (idPedido: string, idDistribuidora: string) => {
        try {
            const response = await connection("usuario_pedido")
                .select("*")
                .where({
                    idUsuarioDestinatario: idDistribuidora,
                    idPedido
                });

            return response;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public checkClientRequest = async (idPedido: string, idCliente: string) => {
        try {
            const response = await connection("usuario_pedido")
                .select("*")
                .where({
                    idUsuarioRemetente: idCliente,
                    idPedido
                });

            return response;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
  
    public async changeStatus(idPedido: string, newStatus: string): Promise<void> {
        await connection("pedido")
             .update({ statusPedido: newStatus })
             .where({ idPedido });
    }

    public cancelServiceOrder = async (idPedido: string) => {
        try {
            await connection("usuario_pedido")
                .where({ idPedido })
                .del()

            await connection("pedido_produto")
                .where({ idPedido })
                .del()

            await connection("pedido")
                .where({ idPedido })
                .del()

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
}