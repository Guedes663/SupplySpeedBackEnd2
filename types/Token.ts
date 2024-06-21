import { TipoUsuario } from "../types/UserType";

export interface TokenData {
    idUsuario: string;
    email: string;
    senha: string;
    tipoUsuario: TipoUsuario;
}
