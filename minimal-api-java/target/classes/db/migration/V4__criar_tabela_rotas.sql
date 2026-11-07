-- Migration V4: Criação da tabela Rotas
-- Dados: Origem, Destino, Veiculo, Motorista, Horario, Distancia, Status

CREATE TABLE IF NOT EXISTS `rotas` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Origem` VARCHAR(255) NOT NULL,
    `Destino` VARCHAR(255) NOT NULL,
    `Veiculo` VARCHAR(150) NULL,
    `Motorista` VARCHAR(150) NULL,
    `Horario` VARCHAR(50) NULL,
    `Distancia` VARCHAR(20) NULL,
    `Status` VARCHAR(20) NULL,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
