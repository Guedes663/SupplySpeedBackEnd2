import express, { Request, Response } from "express";
import cors from "cors";
import connection from "./connection";
import { v4 } from "uuid";
import * as jwt from "jsonwebtoken";
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
function gerarToken(infoDoUsuario: object): any {
    return jwt.sign(
        infoDoUsuario,
        "bananinha",
        { expiresIn: "24h" }
    );
}

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

app.post("/cadastrarUsuario", async (req: Request, res: Response) => {
    try {
        const { nome, email, senha, tipoUsuario, cnpj_cpf, descricao, telefoneCelular, estado, cidade, bairro, rua, numero, cep } = req.body;

        if (!nome || !email || !senha || !tipoUsuario || !cnpj_cpf || !descricao || !telefoneCelular) {
            throw new Error("'nome', 'email', 'senha', 'tipoUsuario', 'cnpj_cpf', 'descricao', 'telefoneCelular', 'estado', 'cidade', 'bairro', 'rua', 'numero' e 'cep' são obrigatórios");
        }

        if (tipoUsuario.toLowerCase() !== "cliente" && tipoUsuario.toLowerCase() !== "distribuidora") {
            throw new Error("O tipo de usuário só pode ser preenchida com 'cliente' ou 'distribuidora'");
        }

        const dadosConsulta = await connection('usuario')
            .select("nome", "email", "cnpj_cpf", "telefoneCelular")
            .whereRaw(
                "LOWER(nome) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR cnpj_cpf LIKE ? OR telefoneCelular LIKE ?",
                [nome, email, cnpj_cpf, telefoneCelular]
            );

        if (dadosConsulta.length > 0) {
            if (dadosConsulta[0].nome === nome) {
                throw new Error("nome de usuário já cadastrado");
            }
            else if (dadosConsulta[0].email === email) {
                throw new Error("Email já cadastrado");
            }
            else if (dadosConsulta[0].cnpj_cpf === cnpj_cpf) {
                throw new Error("cnpj_cpf já cadastrado");
            }
            else if (dadosConsulta[0].telefoneCelular === telefoneCelular) {
                throw new Error("telefone/celular já cadastrado");
            }
        }

        const idUsuario = v4();

        await connection("usuario").insert({
            idUsuario,
            nome,
            email,
            senha,
            tipoUsuario,
            cnpj_cpf,
            descricao,
            telefoneCelular
        });

        await connection("endereco").insert({
            estado,
            cidade,
            bairro,
            rua,
            numero,
            cep,
            idUsuario
        });

        const token = gerarToken({ idUsuario, nome, email, senha, });

        res.status(201).send(token);
    }
    catch (error) {
        if (
            error.message === "'nome', 'email', 'senha', 'tipoUsuario', 'cnpj_cpf', 'descricao', 'telefoneCelular', 'estado', 'cidade', 'bairro', 'rua', 'numero' e 'cep' são obrigatórios"
            || error.messsage === "O tipo de usuário só pode ser preenchida com 'cliente' ou 'distribuidora'"
            || error.message === 'nome de usuário já cadastrado' || error.message === 'Email já cadastrado' || error.message === "cnpj_cpf já cadastrado"
            || error.message === "telefone/celular já cadastrado"
        ) {
            res.status(400).send(error.message);
        }
        else {
            res.status(500).send(error.message);
        }
    }
});

function morgan(arg0: string): any {
    throw new Error("Function not implemented.");
}


function helmet(): any {
    throw new Error("Function not implemented.");
}
*/