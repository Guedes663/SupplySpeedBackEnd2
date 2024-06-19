import connection from "./connection";

export class UserData {

    public checkInfoExist = async (data: any) => {
        try {
            const queryData = await connection('usuario')
                .select("nome", "email", "cnpj_cpf", "telefoneCelular")
                .where(function() {
                    this.whereRaw("LOWER(nome) LIKE LOWER(?)", [`%${data.nome}%`])
                        .orWhereRaw("LOWER(email) LIKE LOWER(?)", [`%${data.email}%`])
                        .orWhere("cnpj_cpf", "LIKE", `%${data.cnpj_cpf}%`)
                        .orWhere("telefoneCelular", "LIKE", `%${data.telefoneCelular}%`);
                });
    
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

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public authenticateUser = async (email: string) => {
        try {
            const queryData = await connection("usuario")
                .select( 'senha', 'idUsuario', 'tipoUsuario' )
                .where({ email });

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
                )
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
                )
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
            const profileType = await connection.select("*").from("usuario").where({ idUsuario });

            return profileType;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public getProfileInformation = async (idUsuario: any) => {
        try {
            let infoUser = await connection("usuario")
                .select(
                    "usuario.telefoneCelular",
                    "usuario.nome",
                    "produto.*",
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

            if (infoUser.length === 0) {
                infoUser = await connection("usuario")
                    .select(
                        "usuario.telefoneCelular",
                        "usuario.nome",
                        "usuario.descricao",
                        "usuario.estado",
                        "usuario.cidade",
                        "usuario.bairro",
                        "usuario.rua",
                        "usuario.numero",
                        "usuario.cep"
                    )
                    .where("usuario.idUsuario", idUsuario);
            }
           

            return infoUser;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}