-- Migration V3: Criação da tabela Motoristas
-- Dados: Nome, Iniciais, Funcao, Telefone, Email, Qtd_Viagem, Pontuacao, Status, Veiculo

CREATE TABLE IF NOT EXISTS `motoristas` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(150) NOT NULL,
    `Iniciais` VARCHAR(10) NULL,
    `Funcao` VARCHAR(50) NULL,
    `Telefone` VARCHAR(20) NULL,
    `Email` VARCHAR(150) NULL,
    `Qtd_Viagem` INT NOT NULL,
    `Pontuacao` DECIMAL(3,2) NOT NULL,
    `Status` VARCHAR(20) NULL,
    `Veiculo` VARCHAR(150) NULL,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
