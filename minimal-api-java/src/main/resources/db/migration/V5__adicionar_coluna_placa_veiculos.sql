-- Migration V5: Adiciona coluna Placa na tabela Veiculos
ALTER TABLE `veiculos` ADD COLUMN `Placa` VARCHAR(20) NULL AFTER `Marca`;
