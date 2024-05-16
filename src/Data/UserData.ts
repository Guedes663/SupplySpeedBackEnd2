import connection from "./connection";

export class UserData {

    checkInfo = async (data: any) => {
        try {
            const queryData = await connection('usuario')
                .select("nome", "email", "cnpj_cpf", "telefoneCelular")
                .whereRaw(
                    "LOWER(nome) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR cnpj_cpf LIKE ? OR telefoneCelular LIKE ?",
                    [data.nome, data.email, data.cnpj_cpf, data.telefoneCelular]
                );

            return queryData;
        } catch (err: any) {

        }
    }

}