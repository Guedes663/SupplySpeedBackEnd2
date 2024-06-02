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
                telefoneCelular,
                estado,
                cidade,
                bairro,
                rua,
                numero,
                cep
            });

            /*await connection("endereco").insert({
                estado,
                cidade,
                bairro,
                rua,
                numero,
                cep,
                idUsuario
            }); */

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public authenticateUser = async (email: string, senha: any) => {
        try {
            const queryData = await connection("usuario")
                .select('idUsuario', 'email', 'senha', 'tipoUsuario')
                .where({ email, senha });

            return queryData;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public searchInformation = async (numPage: any, userData: any) => {
        try {
            if (userData.tipoUsuario.toLowerCase() == "cliente") {
                const distributors = await connection("usuario").select(
                    "usuario.idUsuario",
                    "usuario.nome",
                    "usuario.descricao",
                    "usuario.estado",
                    "usuario.cidade",
                    "usuario.bairro",
                    "usuario.rua",
                    "usuario.numero",
                    "usuario.cep"
                    //"endereco.*",
                    //"produto.*",
                    //"produto.descricao as produto_descricao"
                )
                    //.from("usuario")
                    //.innerJoin("endereco", "usuario.idUsuario", "endereco.idUsuario")
                    //.innerJoin("usuario_produto", "usuario.idUsuario", "usuario_produto.idUsuario")
                    //.innerJoin("produto", "usuario_produto.idProduto", "produto.idProduto")
                    .where("usuario.tipoUsuario", "LIKE", "distribuidora")
                    .limit(10)
                    .offset((parseInt(numPage) - 1) * 10);

                return distributors;
            }
            else {
                const customers = await connection.select(
                    "usuario.nome",
                    "usuario.descricao",
                    "usuario.estado",
                    "usuario.cidade",
                    "usuario.bairro",
                    "usuario.rua",
                    "usuario.numero",
                    "usuario.cep"
                    //"endereco.*"
                )
                    //.from("usuario")
                    //.innerJoin("endereco", "usuario.idUsuario", "endereco.idUsuario")
                    .where("usuario.tipoUsuario", "LIKE", "cliente")
                    .limit(10)
                    .offset((parseInt(numPage) - 1) * 10);

                return customers;
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public checkIdPerfil = async (idUsuario: any) => {
        try {
            const profileType = await connection.select("tipoUsuario").from("usuario").where({ idUsuario });

            return profileType;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public getProfileInformation = async (idUsuario: any) => {
        try {
            const infoUser = await connection("usuario")
                .select(
                    "usuario.telefoneCelular",
                    "usuario.nome",
                    "produto.*",
                    //"usuario.imagemDoUsuario",
                    "usuario.descricao",
                    "usuario.estado",
                    "usuario.cidade",
                    "usuario.bairro",
                    "usuario.rua",
                    "usuario.numero",
                    "usuario.cep"
                )
                .innerJoin("usuario_produto", "usuario.idUsuario", "usuario_produto.idUsuario")
                .innerJoin("produto", "usuario_produto.idProduto", "produto.idProduto")
                .where("usuario.idUsuario", idUsuario);

            /*const addressUser = await connection("endereco")
                .select("*")
                .where("endereco.idUsuario", idUsuario);
            */

            return infoUser;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}