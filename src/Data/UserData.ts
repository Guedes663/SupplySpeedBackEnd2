import { isThrowStatement } from "typescript";
import connection from "./connection";

export class UserData {

    public checkInfoExist = async (data: any) => {
        try {
            const queryData = await connection('usuario')
                .select("nome", "email", "cnpj_cpf", "telefoneCelular")
                .whereRaw(
                    "LOWER(nome) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR cnpj_cpf LIKE ? OR telefoneCelular LIKE ?",
                    [data.nome, data.email, data.cnpj_cpf, data.telefoneCelular]
                );

            return queryData;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public registerUser = async (data: any, idUsuario: string) => {
        try {

            const { nome, email, senha, tipoUsuario, cnpj_cpf, descricao, telefoneCelular, estado, cidade, bairro, rua, numero, cep } = data;

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

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public authenticateUser = async (email: string, senha: any) => {
        try {
            const queryData = await connection("usuario")
                .select('idUsuario', 'email', 'senha')
                .where({ email, senha });

            return queryData;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}