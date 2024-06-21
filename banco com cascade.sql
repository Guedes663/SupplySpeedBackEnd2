DROP DATABASE IF EXISTS supplyspeedbd;
CREATE DATABASE supplyspeedbd;
USE supplyspeedbd;

CREATE TABLE usuario (
    idUsuario VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE, 
    email VARCHAR(50) NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    tipoUsuario TEXT NOT NULL,
    CNPJ_CPF VARCHAR(18) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    telefoneCelular VARCHAR(11) NOT NULL UNIQUE,
    estado VARCHAR(2) NOT NULL,
    cidade TEXT NOT NULL,
    bairro TEXT NOT NULL,
    rua TEXT NOT NULL,
    numero TEXT NOT NULL,
    cep VARCHAR(9) NOT NULL
);

CREATE TABLE pedido (
    idPedido VARCHAR(255) NOT NULL PRIMARY KEY,
    statusPedido TEXT NOT NULL,
    dataHora VARCHAR(16) NOT NULL
);

CREATE TABLE usuario_pedido (
    idUsuarioRemetente VARCHAR(255) NOT NULL,
    idUsuarioDestinatario VARCHAR(255) NOT NULL,
    idPedido VARCHAR(255) NOT NULL,
    PRIMARY KEY (idUsuarioRemetente, idUsuarioDestinatario, idPedido),
    FOREIGN KEY (idUsuarioRemetente) REFERENCES usuario(idUsuario) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idUsuarioDestinatario) REFERENCES usuario(idUsuario) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPedido) REFERENCES pedido(idPedido) 
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE produto (
    idProduto VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
    descricao TEXT NOT NULL,
    valorUnidade FLOAT NOT NULL,
    nomeComercial TEXT NOT NULL,
    nomeTecnico TEXT NOT NULL,
    peso FLOAT NOT NULL,
    material TEXT NOT NULL,
    dimensoes VARCHAR(50) NOT NULL,
    fabricante TEXT NOT NULL,
    statusProduto BOOLEAN DEFAULT TRUE
);

CREATE TABLE pedido_produto (
    idPedido VARCHAR(255) NOT NULL,
    idProduto VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    PRIMARY KEY (idPedido, idProduto),
    FOREIGN KEY (idPedido) REFERENCES pedido(idPedido) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto) 
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE usuario_produto (
    idUsuario VARCHAR(255) NOT NULL,
    idProduto VARCHAR(255) NOT NULL,
    PRIMARY KEY (idUsuario, idProduto),
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto) 
        ON DELETE CASCADE ON UPDATE CASCADE
);
