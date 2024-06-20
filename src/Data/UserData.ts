import { UsuarioModelo } from "../models/UserModel";
import { UsuarioProduto } from "../models/UserProduct";
import connection from "./connection";


export class UserData {

    public checkInfoExist = async (usuarioModelo: UsuarioModelo) => {
        try {
            const queryData = await connection('usuario')
                .where({
                    cnpj_cpf: usuarioModelo.cnpj_cpf,
                    email: usuarioModelo.email,
                    nome: usuarioModelo.nome,
                    telefoneCelular: usuarioModelo.telefoneCelular
                })
                .select('*');
    
            return queryData.length > 0; 
    
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    
    

    public registerUser = async (usuarioModelo: UsuarioModelo) => {
        try {
            await connection("usuario").insert({
                nome: usuarioModelo.nome,
                email: usuarioModelo.email,
                senha: usuarioModelo.senha,
                tipoUsuario: usuarioModelo.tipoUsuario,
                cnpj_cpf: usuarioModelo.cnpj_cpf,
                descricao: usuarioModelo.descricao,
                telefoneCelular: usuarioModelo.telefoneCelular,
                estado: usuarioModelo.estado,
                cidade: usuarioModelo.cidade,
                bairro: usuarioModelo.bairro,
                rua: usuarioModelo.rua,
                numero: usuarioModelo.numero,
                cep: usuarioModelo.cep,
                idUsuario: usuarioModelo.idUsuario
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

    public searchInformation = async (numPage: any, token: any) => {
        try {
            if (token.tipoUsuario.toLowerCase() == "cliente") {
                const distributors = await connection("usuario").select(
                    token
                )
                    .where(token.tipoUsuario, 'like', '%distribuidora%')
                    .limit(10)
                    .offset((parseInt(numPage) - 1) * 10);

                return distributors;
            }
            else {
                const customers = await connection.select(
                    "usuario"
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

    public checkIdPerfil = async (idUsuario: string) => {
        try {
            const profileType = await connection.select("*").from("usuario").where({ idUsuario });

            return profileType;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public getProfileInformation = async (idUsuario: string) => {
        try {
            let usuarioModelo: UsuarioModelo;
            let UsuarioProduto: UsuarioProduto ;
            let infoUser = await connection("usuario")
                .select(
                    usuarioModelo
                )
                .innerJoin("usuario_produto", usuarioModelo.idUsuario, UsuarioProduto.idUsuario)
                .innerJoin("produto", UsuarioProduto.idProduto, "produto.idProduto")
                .where(usuarioModelo.idUsuario, idUsuario);

            if (infoUser.length === 0) {
                infoUser = await connection("usuario")
                    .select(
                        usuarioModelo
                    )
                    .where(usuarioModelo.idUsuario, idUsuario);
            }
           

            return infoUser;

        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}


