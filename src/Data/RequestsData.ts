import connection from "./connection";

export class RequestsData {

    public searchOrders = async (userData: any) => {
        try {
            let query = connection("usuario_pedido")
                .select(
                    "usuario.nome",
                    "pedido.idPedido",
                    "pedido.dataHora",
                    "pedido.statusPedido",
                    "usuario.estado",
                    "usuario.cidade",
                    "usuario.bairro",
                    "usuario.rua",
                    "usuario.numero",
                    "usuario.cep",
                    "pedido_produto.quantidade",
                    "produto.descricao",
                    "produto.valorUnidade",
                    "produto.nomeComercial",
                    "produto.nomeTecnico",
                    "produto.peso",
                    "produto.material",
                    "produto.dimensoes",
                    "produto.fabricante"
                )
                .innerJoin("usuario", function() {
                    if (userData.tipoUsuario.toLowerCase() === "cliente") {
                        this.on("usuario_pedido.idUsuarioDestinatario", "=", "usuario.idUsuario");
                    } else {
                        this.on("usuario_pedido.idUsuarioRemetente", "=", "usuario.idUsuario");
                    }
                })
                .innerJoin("pedido", "usuario_pedido.idPedido", "=", "pedido.idPedido")
                .innerJoin("pedido_produto", "pedido.idPedido", "=", "pedido_produto.idPedido")
                .innerJoin("produto", "pedido_produto.idProduto", "=", "produto.idProduto");
    
            if (userData.tipoUsuario.toLowerCase() === "cliente") {
                query.where("usuario_pedido.idUsuarioRemetente", userData.idUsuario);
            } else {
                query.where("usuario_pedido.idUsuarioDestinatario", userData.idUsuario);
            }
    
            const orders = await query;
    
            return orders;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    public distributorCheck = async (idUsuario: any) => {
        try {
            const response = await connection("usuario")
                .select("tipoUsuario")
                .where({ idUsuario });

            return response;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public checkProduct = async (idProduto: any) => {
        try {
            const response = await connection("usuario_produto")
                .select("idUsuario")
                .where({ idProduto });

            return response;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public checkAddress = async (idEndereco: any) => {
        try {
            const response = await connection("endereco")
                .select("idEndereco")
                .where({ idEndereco });

            return response;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public SendServiceOrder = async (idPedido: any, dataHora: any,  idDistribuidora: any, idCliente: any, arrayProdutos: any) => {
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
            throw new Error(err.message);
        }
    }

    public checkRequest = async (idPedido: any) => {
        try {
            const response = await connection("pedido")
                .select("idPedido", "statusPedido")
                .where({ idPedido });

            return response;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public checkDistributorRequest = async (idPedido: any, idDistribuidora: any) => {
        try {
            const response = await connection("usuario_pedido")
                .select("*")
                .where({
                    idUsuarioDestinatario: idDistribuidora,
                    idPedido
                });

            return response;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public checkClientRequest = async (idPedido: any, idCliente: any) => {
        try {
            const response = await connection("usuario_pedido")
                .select("*")
                .where({
                    idUsuarioRemetente: idCliente,
                    idPedido
                });

            return response;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }
  
    public async changeStatus(idPedido: any, newStatus: string): Promise<void> {
        await connection("pedido")
             .update({ statusPedido: newStatus })
             .where({ idPedido });
    }

    public cancelServiceOrder = async (idPedido: any) => {
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
            throw new Error(err.message);
        }
    }
}