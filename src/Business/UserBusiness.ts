import { UserData } from "../Data/UserData";
import { CustomError } from "../utils/CustomError";
import { v4 } from "uuid";
import * as jwt from "jsonwebtoken";

export class UserBusiness {

    constructor(private userData: UserData) { }

    private gerarToken = (infoDoUsuario: object) => {
        return jwt.sign(
            infoDoUsuario,
            process.env.KEY_TOKEN,
            { expiresIn: "24h" }
        );
    }

    public registerUser = async (registrationData: any) => {
        try {
            const { nome, email, senha, tipoUsuario, cnpj_cpf, descricao, telefoneCelular, estado, cidade, bairro, rua, numero, cep } = registrationData;

            if (!nome || !email || !senha || !tipoUsuario || !cnpj_cpf || !descricao || !telefoneCelular) {
                throw new CustomError("'nome', 'email', 'senha', 'tipoUsuario', 'cnpj_cpf', 'descricao', 'telefoneCelular', 'estado', 'cidade', 'bairro', 'rua', 'numero' e 'cep' são obrigatórios", 400);
            }

            if (tipoUsuario.toLowerCase() !== "cliente" && tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("O tipo de usuário só pode ser preenchida com 'cliente' ou 'distribuidora'", 400);
            }

            const dataChecked = await this.userData.checkInfoExist({ nome, email, cnpj_cpf, telefoneCelular });

            if (dataChecked.length > 0) {
                if (dataChecked[0].nome === nome) {
                    throw new CustomError("nome de usuário já cadastrado", 400);
                }
                else if (dataChecked[0].email === email) {
                    throw new CustomError("Email já cadastrado", 400);
                }
                else if (dataChecked[0].cnpj_cpf === cnpj_cpf) {
                    throw new CustomError("cnpj_cpf já cadastrado", 400);
                }
                else if (dataChecked[0].telefoneCelular === telefoneCelular) {
                    throw new CustomError("telefone/celular já cadastrado", 400);
                }
            }

            const idUsuario = v4();

            await this.userData.registerUser(registrationData, idUsuario);

            const token = this.gerarToken({ idUsuario, email, senha, });
            return token;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public login = async (loginData: any) => {
        try {
            const { email, senha } = loginData;

            if(!email || !senha) {
                throw new CustomError("Email ou senha não foi recebido!", 400);
            }

            const result = await this.userData.authenticateUser(email, senha);

            if(result.length === 0) {
                throw new CustomError("Email ou senha incorreto!", 400);
            }

            const { idUsuario } = result[0];
            const token = this.gerarToken({ idUsuario, email, senha });
            return token;

        } catch(err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
}