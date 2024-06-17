import { UserData } from "../Data/UserData";
import { CustomError } from "../utils/CustomError";
import { TokenUtils } from "../utils/TokenUtils";
import { uuidv7 as v7} from '@kripod/uuidv7';
import { HashManager } from "../utils/HashManager";

export class UserBusiness {

    constructor(
        private userData: UserData,
        private hashManager = new HashManager()
    ) { }

    public registerUser = async (registrationData: any) => {
        try {
            const { nome, email, senha, tipoUsuario, cnpj_cpf, descricao, telefoneCelular, estado, cidade, bairro, rua, numero, cep } = registrationData;

            if (!nome || !email || !senha || !tipoUsuario || !cnpj_cpf || !descricao || !telefoneCelular || !estado || !cidade || !bairro || !rua || !numero || !cep) {
                throw new CustomError("'nome', 'email', 'senha', 'tipoUsuario', 'cnpj_cpf', 'descricao', 'telefoneCelular', 'estado', 'cidade', 'bairro', 'rua', 'numero' e 'cep' são obrigatórios", 400);
            }

            if (tipoUsuario.toLowerCase() !== "cliente" && tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("O tipo de usuário só pode ser preenchida com 'cliente' ou 'distribuidora'", 400);
            }

            const dataChecked = await this.userData.checkInfoExist({ nome, email, cnpj_cpf, telefoneCelular });

            if (dataChecked.length > 0) {
                if (dataChecked[0].nome === nome) {
                    throw new CustomError("nome de usuário já cadastrado", 409);
                }
                else if (dataChecked[0].email === email) {
                    throw new CustomError("Email já cadastrado", 409);
                }
                else if (dataChecked[0].cnpj_cpf === cnpj_cpf) {
                    throw new CustomError("cnpj_cpf já cadastrado", 409);
                }
                else if (dataChecked[0].telefoneCelular === telefoneCelular) {
                    throw new CustomError("telefone/celular já cadastrado", 409);
                }
            }

            const idUsuario = v7();
            registrationData.senha = await this.hashManager.hashPassword(senha);

            await this.userData.registerUser(registrationData, idUsuario);

            const token = TokenUtils.generateToken({ idUsuario, email, senha, tipoUsuario });
            return token;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public login = async (loginData: any) => {
        try {
            const { email, senha } = loginData;

            if (!email || !senha) {
                throw new CustomError("Email ou senha não foi recebido!", 400);
            }
            
            const result = await this.userData.authenticateUser(email);

            if (result.length === 0) {
                throw new CustomError("Email incorreto!", 401);
            }

            const correctPassword = await this.hashManager.comparePassword(senha, result[0].senha);

            if ( !correctPassword ) {
                throw new CustomError("Senha incorreta!", 401);
            }

            const { idUsuario, tipoUsuario } = result[0];
            const token = TokenUtils.generateToken({ idUsuario, email, senha, tipoUsuario });
            return token;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public searchInformation = async (numPage: any, token: any) => {
        try {
            if (numPage == "null" || parseInt(numPage) < 1) {
                throw new CustomError("Número da página está faltando ou não é válido!", 400);
            }

            const tokenData = TokenUtils.getTokenInformation(token);
            const users = await this.userData.searchInformation(numPage, tokenData);

            return users;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

    public getProfileInformation = async (token: any, idProfile: any) => {
        try {
            TokenUtils.getTokenInformation(token);

            const profileType = await this.userData.checkIdPerfil(idProfile);

            if (profileType.length < 1 /*|| profileType[0].tipoUsuario !== "distribuidora"*/) {
                throw new CustomError("O id do usuário que você passou não existe", 400);
            }

            const profileInformation = await this.userData.getProfileInformation(idProfile);

            return profileInformation;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
}