import { UserData } from "../Data/UserData";
import { CustomError } from "../utils/CustomError";
import { TokenUtils } from "../utils/TokenUtils";
import { uuidv7 as v7} from '@kripod/uuidv7';
import { HashManager } from "../utils/HashManager";
import { UsuarioModelo } from "../models/UserModel";



export class UserBusiness {

    constructor(
        private userData: UserData,
        private hashManager = new HashManager()
    ) { }

    public registerUser = async (registrationData: UsuarioModelo) => {
        try {
            const { nome, email, senha, tipoUsuario, cnpj_cpf, telefoneCelular } = registrationData;
    
            if (!registrationData) {
                throw new CustomError("itens faltando no registro", 400);
            }
    
            if (tipoUsuario.toLowerCase() !== "cliente" && tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("O tipo de usuário só pode ser preenchida com 'cliente' ou 'distribuidora'", 400);
            }
            const idUsuario = v7(); 
            registrationData.idUsuario = idUsuario
            console.log(registrationData)

            const dataChecked:any = await this.userData.checkInfoExist(registrationData);
            const SenhaForte = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[^\w\d\s]).{8,}$/;
    
            if (dataChecked.length > 0) {
                if (dataChecked[0].nome === nome) {
                    throw new CustomError("nome de usuário já cadastrado", 409);
                } else if (dataChecked[0].email === email) {
                    throw new CustomError("Email já cadastrado", 409);
                } else if (dataChecked[0].cnpj_cpf === cnpj_cpf) {
                    throw new CustomError("cnpj_cpf já cadastrado", 409);
                } else if (dataChecked[0].telefoneCelular === telefoneCelular) {
                    throw new CustomError("telefone/celular já cadastrado", 409);
                }
            }
    
            if (!SenhaForte.test(senha)) {
                throw new CustomError("A senha não atende aos critérios de segurança. Certifique-se de que ela contenha pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.", 400);
            }
    
            registrationData.senha = await this.hashManager.hashPassword(senha);
    
            await this.userData.registerUser(registrationData);
    
            const token = TokenUtils.generateToken({ idUsuario, email, tipoUsuario });
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

    public searchInformation = async (numPage: string, token: string) => {
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

    public getProfileInformation = async (token: string, idProfile: string) => {
        try {
            TokenUtils.getTokenInformation(token);
            if(!token){
                throw new CustomError("O token que você passou não existe", 400);
            }
            const profileType = await this.userData.checkIdPerfil(idProfile);

            if (profileType.length < 1 ) {
                throw new CustomError("O id do usuário que você passou não existe", 400);
            }

            const profileInformation = await this.userData.getProfileInformation(idProfile);

            return profileInformation;

        } catch (err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }
}