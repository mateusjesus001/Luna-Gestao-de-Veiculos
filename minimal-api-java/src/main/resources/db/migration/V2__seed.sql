-- Migration V2: Seed de dados iniciais (Administrador padrão e Veículos de exemplo)

-- Seed: Administrador padrão (equivalente ao DbContexto.cs do projeto .NET)
-- Note: no .NET o seed usava Id = -1, mas aqui usamos auto-increment normal.
-- O email foi corrigido sem espaços (o .NET tinha ' administrador@teste.com ' com espaços).
-- Por ser banco compartilhado com o projeto .NET, os INSERTs são condicionais
-- (só inserem se o email ainda não existir), evitando duplicados.
INSERT INTO `administradores` (`Email`, `Senha`, `Perfil`)
SELECT 'administrador@teste.com', '123456', 'Adm'
WHERE NOT EXISTS (SELECT 1 FROM `administradores` WHERE TRIM(`Email`) = 'administrador@teste.com');

INSERT INTO `administradores` (`Email`, `Senha`, `Perfil`)
SELECT 'editor@teste.com', '123456', 'Editor'
WHERE NOT EXISTS (SELECT 1 FROM `administradores` WHERE TRIM(`Email`) = 'editor@teste.com');

-- Seed: Veículos de exemplo (condicional, só se a tabela estiver vazia)
INSERT INTO `veiculos` (`Nome`, `Marca`, `Ano`)
SELECT 'Opala', 'Chevrolet', 1973
WHERE NOT EXISTS (SELECT 1 FROM `veiculos` LIMIT 1);

INSERT INTO `veiculos` (`Nome`, `Marca`, `Ano`)
SELECT 'Fusca', 'Volkswagen', 1976
WHERE NOT EXISTS (SELECT 1 FROM `veiculos` WHERE `Nome` = 'Fusca' AND `Marca` = 'Volkswagen');

INSERT INTO `veiculos` (`Nome`, `Marca`, `Ano`)
SELECT 'RX-7', 'Mazda', 1992
WHERE NOT EXISTS (SELECT 1 FROM `veiculos` WHERE `Nome` = 'RX-7' AND `Marca` = 'Mazda');