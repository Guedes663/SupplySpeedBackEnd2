import connection from "../connection";

export class UserData {

    registerUser = async () => {
        const dadosConsulta = await connection('usuario')
        .select("nome", "email", "cnpj_cpf", "telefoneCelular")
        .whereRaw(
            "LOWER(nome) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR cnpj_cpf LIKE ? OR telefoneCelular LIKE ?",
            [nome, email, cnpj_cpf, telefoneCelular]
        );
    }

}