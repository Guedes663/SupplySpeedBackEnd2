import express, { Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(cors());

// Configura as rotas da aplicação
app.use('/users/', userRoutes);

// Rota principal para verificar se o servidor está funcionando
app.get('/', (req: Request, res: Response) => {
    res.send('API funcionando!');
});

// Tratamento de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack); // Loga o erro no console
    res.status(500).send('Algo deu errado!'); // Responde com status 500 e uma mensagem de erro
});


// Porta em que o servidor vai rodar
app.listen(process.env.PORT || 3003, () => {
    console.log("Server is running in http://localhost:3003");
});

/*
app.get("/buscarPedidos/:idUsuario", async (req: Request, res: Response) => {
    try {
        const idUsuario: string = req.params.idUsuario;

        const dadosUsuario = await connection("usuario").select("tipoUsuario")
            .from("usuario")
            .where("idUsuario", idUsuario);

        if (dadosUsuario[0] == null) {
            throw new Error("Id do usuário inválido!");
        }

        if (dadosUsuario[0].tipoUsuario.toLowerCase() == "cliente") {
            const dadosPedidosEnviado = await connection("usuario_pedido").select(
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
                .where("usuario_pedido.idUsuarioRemetente", idUsuario);

            res.status(200).send(dadosPedidosEnviado[0]);
        }
        else {
            const dadosPedidosRecebidos = await connection("usuario_pedido").select(
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
                .where("usuario_pedido.idUsuarioDestinatario", idUsuario);

            res.status(200).send(dadosPedidosRecebidos[0]);
        }

    } catch (error: any) {
        if (error.message == "Id do usuário inválido!") {
            res.status(400).send(error.message);
        }
        else {
            res.status(500).send(error.message);
        }
    }
});

app.get("/buscarInfo/:numPagina/:idUsuario", async (req: Request, res: Response) => {
    try {
        const numPagina = req.params.numPagina;
        const idUsuario = req.params.idUsuario;

        if (numPagina == "null" || parseInt(numPagina) < 1) {
            throw new Error("Número da página está faltando ou não é válido!");
        }

        const dadosUsuario = await connection("usuario").select("tipoUsuario")
            .from("usuario")
            .where("idUsuario", idUsuario);

        if (dadosUsuario[0] == null) {
            throw new Error("Id do usuário inválido!");
        }

        if (dadosUsuario[0].tipoUsuario.toLowerCase() == "cliente") {
            const dadosDeDistribuidoras = await connection("usuario").select(
                "usuario.nome",
                "usuario.descricao",
                "endereco.*",
                "produto.*"
            )
                .from("usuario")
                .innerJoin("endereco", "usuario.idUsuario", "endereco.idUsuario")
                .innerJoin("usuario_produto", "usuario.idUsuario", "usuario_produto.idUsuario")
                .innerJoin("produto", "usuario_produto.idProduto", "produto.idProduto")
                .where("usuario.tipoUsuario", "LIKE", "distribuidora")
                .limit(10)
                .offset((parseInt(numPagina) - 1) * 10);

            res.status(200).send(dadosDeDistribuidoras);
        }
        else {
            const dadosDeClientes = await connection.select(
                "usuario.nome",
                "usuario.descricao",
                "endereco.*"
            )
                .from("usuario")
                .innerJoin("endereco", "usuario.idUsuario", "endereco.idUsuario")
                .where("usuario.tipoUsuario", "LIKE", "cliente")
                .limit(10)
                .offset((parseInt(numPagina) - 1) * 10);

            res.status(200).send(dadosDeClientes);
        }

    } catch (error) {
        if (error.message == "Id do usuário inválido!" || error.message == "Número da página está faltando ou não é válido!") {
            res.status(400).send(error.message);
        }
        else {
            res.status(500).send(error.message);
        }
    }
});
*/