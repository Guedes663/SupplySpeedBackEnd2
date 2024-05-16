import { UserData } from "../Data/UserData";
import { CustomError } from "../utils/CustomError";

export class UserBusiness {

    constructor(private userData: UserData) {}

    registerUser = async (registrationData: any) => {
        try{ 
            const { nome, email, senha, tipoUsuario, cnpj_cpf, descricao, telefoneCelular, estado, cidade, bairro, rua, numero, cep } = registrationData;

            if (!nome || !email || !senha || !tipoUsuario || !cnpj_cpf || !descricao || !telefoneCelular) {
                throw new CustomError("'nome', 'email', 'senha', 'tipoUsuario', 'cnpj_cpf', 'descricao', 'telefoneCelular', 'estado', 'cidade', 'bairro', 'rua', 'numero' e 'cep' são obrigatórios", 400);
            }

            if (tipoUsuario.toLowerCase() !== "cliente" && tipoUsuario.toLowerCase() !== "distribuidora") {
                throw new CustomError("O tipo de usuário só pode ser preenchida com 'cliente' ou 'distribuidora'", 400);
            }

            const dataChecked = await this.userData.checkInfo({nome, email, cnpj_cpf, telefoneCelular});

            return dataChecked;

        } catch(err: any) {
            throw new CustomError(err.message, err.statusCode);
        }
    }

}