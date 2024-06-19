import { PedidoStatus } from "../types/statusType";

export interface ProductData {
    descricao: string;
    valorUnidade: number;
    nomeComercial: string;
    nomeTecnico: string;
    peso: number;
    material: string;
    dimensoes: string;
    fabricante: string;
    statusProduto: PedidoStatus;
}