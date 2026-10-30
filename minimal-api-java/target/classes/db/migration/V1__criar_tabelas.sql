-- Migration V1: Criação das tabelas Administradores e Veiculos

CREATE TABLE IF NOT EXISTS `administradores` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(255) NOT NULL,
    `Senha` VARCHAR(50) NOT NULL,
    `Perfil` VARCHAR(10) NOT NULL,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `veiculos` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(150) NOT NULL,
    `Marca` VARCHAR(100) NOT NULL,
    `Ano` INT NOT NULL,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;