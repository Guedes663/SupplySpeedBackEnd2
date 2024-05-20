import express, { Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./routes/userRoutes";
import { requestsRoutes } from "./routes/requestsRoutes";

const app = express();

app.use(express.json());
app.use(cors());

// Configura as rotas da aplicação
app.use("/users/", userRoutes);
app.use("/requests/", requestsRoutes);

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