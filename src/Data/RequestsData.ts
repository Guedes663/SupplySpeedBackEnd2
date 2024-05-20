import connection from "./connection";

export class RequestsData {

    public searchOrders = async (userData: any) => {
        try {
            if (userData.tipoUsuario.toLowerCase() === "cliente") {
                const ordersShipped = await connection("usuario_pedido").select(
                    "usuario.nome",
                    "pedido.dataEntrega",
                    "pedido.statusPedido",
                    "endereco.estado",
                    "endereco.cidade",
                    "endereco.bairro",
                    "endereco.rua",
                    "endereco.numero",
                    "endereco.cep",
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
                    .from("usuario_pedido")
                    .innerJoin("usuario", "usuario_pedido.idUsuarioDestinatario", "usuario.idUsuario")
                    .innerJoin("pedido", "usuario_pedido.idPedido", "pedido.idPedido")
                    .innerJoin("endereco", "pedido.idEndereco", "endereco.idEndereco")
                    .innerJoin("pedido_produto", "pedido.idPedido", "pedido_produto.idPedido")
                    .innerJoin("produto", "pedido_produto.idProduto", "produto.idProduto")
                    .where("usuario_pedido.idUsuarioRemetente", userData.idUsuario);

                return ordersShipped;
            } 
            else {
                const ordersReceived = await connection("usuario_pedido").select(
                    "usuario.nome",
                    "pedido.dataEntrega",
                    "pedido.statusPedido",
                    "endereco.estado",
                    "endereco.cidade",
                    "endereco.bairro",
                    "endereco.rua",
                    "endereco.numero",
                    "endereco.cep",
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
                    .from("usuario_pedido")
                    .innerJoin("usuario", "usuario_pedido.idUsuarioRemetente", "usuario.idUsuario")
                    .innerJoin("pedido", "usuario_pedido.idPedido", "pedido.idPedido")
                    .innerJoin("endereco", "pedido.idEndereco", "endereco.idEndereco")
                    .innerJoin("pedido_produto", "pedido.idPedido", "pedido_produto.idPedido")
                    .innerJoin("produto", "pedido_produto.idProduto", "produto.idProduto")
                    .where("usuario_pedido.idUsuarioDestinatario", userData.idUsuario);

                return ordersReceived;
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

}