 DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `Id_bling` varchar(255) NOT NULL DEFAULT '0',
  `descricao` varchar(255) NOT NULL DEFAULT '',
  `codigo_sistema` int(11) NOT NULL DEFAULT 0,
  `data_envio` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`Id_bling`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `Id_bling` varchar(255) NOT NULL DEFAULT '',
  `codigo_sistema` varchar(255) NOT NULL DEFAULT '',
  `cpf` varchar(255) NOT NULL DEFAULT '',
  `data_envio` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`Id_bling`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

DROP TABLE IF EXISTS `config_bling`;
CREATE TABLE `config_bling` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `importar_pedidos` int(11) NOT NULL DEFAULT 0,
  `enviar_estoque` int(10) NOT NULL DEFAULT 0,
  `enviar_precos` int(11) NOT NULL DEFAULT 0,
  `tabela_preco` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `config_bling` VALUES (1,0,0,0,0);

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos` (
  `Id_bling` varchar(255) NOT NULL DEFAULT '0',
  `codigo_sistema` int(11) NOT NULL DEFAULT 0,
  `data_insercao` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`Id_bling`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `produtos`;
CREATE TABLE `produtos` (
  `Id_bling` varchar(255) NOT NULL DEFAULT '0',
  `descricao` varchar(255) NOT NULL DEFAULT '',
  `codigo_sistema` int(11) NOT NULL DEFAULT 0,
  `data_envio` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `saldo_enviado` decimal(16,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`Id_bling`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `produtos_get`;
CREATE TABLE `produtos_get` (
  `Id_bling` varchar(255) NOT NULL DEFAULT '0',
  `descricao` varchar(255) NOT NULL DEFAULT '',
  `codigo_sistema` int(11) NOT NULL DEFAULT 0,
  `data_envio` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`Id_bling`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `expires_in` varchar(255) DEFAULT NULL,
  `ult_atualizacao` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;