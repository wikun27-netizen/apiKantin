-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for kantin
CREATE DATABASE IF NOT EXISTS `kantin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `kantin`;

-- Dumping structure for table kantin.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table kantin.failed_jobs: ~0 rows (approximately)

-- Dumping structure for table kantin.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table kantin.migrations: ~0 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2014_10_12_000000_create_users_table', 1),
	(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
	(3, '2019_08_19_000000_create_failed_jobs_table', 1),
	(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(5, '2025_02_10_035401_user', 1);

-- Dumping structure for table kantin.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table kantin.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table kantin.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table kantin.personal_access_tokens: ~0 rows (approximately)

-- Dumping structure for table kantin.reqtransaksi
CREATE TABLE IF NOT EXISTS `reqtransaksi` (
  `idReq` bigint NOT NULL AUTO_INCREMENT,
  `H_Timestamp` varchar(100) NOT NULL DEFAULT '0',
  `UserTujuan` varchar(255) NOT NULL,
  `Nominal` decimal(19,4) NOT NULL,
  `idTransaksi` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idReq`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table kantin.reqtransaksi: ~9 rows (approximately)
INSERT INTO `reqtransaksi` (`idReq`, `H_Timestamp`, `UserTujuan`, `Nominal`, `idTransaksi`, `created_at`) VALUES
	(1, 'fdc6b31ec2e4a20ce8f6997f209452f339242ff681787bc0de129af571faa435', 'sa', 10000.0000, NULL, '2025-02-16 23:51:20'),
	(2, 'dd7b7b94ab6b7b6bc3178b0bcdad4541b8315768676e85151d41a44a6f36a965', 'BeliA', 10000.0000, NULL, '2025-02-17 00:03:40'),
	(3, '0917fd38f996a3ec15c68bddc55791b221f085ac7358eee47c590b36b394a184', 'JualA', 10000.0000, 20, '2025-02-17 00:05:11'),
	(4, 'f2c1b83fa2cc29a15c7516fc8cf4ae91e91755cc3300588705c9deb95f83e3c4', 'JualA', 10000.0000, NULL, '2025-02-17 17:17:23'),
	(5, '8c477fcfbe372d70717b511832459c02ece7b8b7d8ef59b5d0aab3f4ae8d469f', 'JualA', 10000.0000, 21, '2025-02-17 17:18:36'),
	(6, '013040d73e0f1c30bf415175a162872d30f7d424db53595335fb5effcc643558', 'JualA', 25000.0000, 22, '2025-02-17 17:24:41'),
	(7, 'd4cae83b377eee53a13f468ead9df19e7f453825cd9f59a7f964b6cc96673664', 'JualA', 2000.0000, 24, '2025-02-18 11:53:36'),
	(8, '38f30929705c466544863d477f5458af8818ce5454b9bc755352585295aa4d46', 'JualA', 2000.0000, NULL, '2025-02-18 11:56:28'),
	(9, 'ac3501d4e0dc7b898da8a8f7c44e12f38b7f23726e3a8e343e5fb17df835958f', 'JualA', 2000.0000, 160, '2025-03-05 14:46:32');

-- Dumping structure for table kantin.saldo
CREATE TABLE IF NOT EXISTS `saldo` (
  `UserName` varchar(255) NOT NULL,
  `Nominal` decimal(19,4) NOT NULL,
  `lastIdTransaksi` bigint NOT NULL,
  PRIMARY KEY (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table kantin.saldo: ~9 rows (approximately)
INSERT INTO `saldo` (`UserName`, `Nominal`, `lastIdTransaksi`) VALUES
	('BeliA', 999000.0000, 160),
	('BeliB', 1000.0000, 156),
	('beliC', 1000.0000, 157),
	('beliD', 10000.0000, 154),
	('JualA', 1002000.0000, 160),
	('lala', 0.0000, 0),
	('pembeliC', 0.0000, 0),
	('penjualB', 23000.0000, 133),
	('PenjualC', 0.0000, 131),
	('penjualD', 0.0000, 132),
	('sa', -1713000.0000, 159);

-- Dumping structure for procedure kantin.SP_KosonginSaldoRole
DELIMITER //
CREATE PROCEDURE `SP_KosonginSaldoRole`(
	IN `_RoleID` INT,
	IN `_UserName` VARCHAR(255)
)
BEGIN

	DECLARE _UserAsal VARCHAR(255);
	
	DECLARE _SaldoAwalUserAsal DECIMAL(19,4);
	DECLARE _SaldoAkhirUserAsal DECIMAL(19,4);
	
	DECLARE _SaldoAwalUserTujuan DECIMAL(19,4);
	DECLARE _SaldoAkhirUserTujuan DECIMAL(19,4);
	
	DECLARE _idTransaksi BIGINT;

	DECLARE _counter INT DEFAULT 0;
	DECLARE _total_rows INT;
	
	CREATE TEMPORARY TABLE temp_user AS
	SELECT UserName from user WHERE RoleID = _RoleID AND IsAktif = 1;

	SELECT COUNT(1) INTO _total_rows FROM temp_user;
	while _counter < _total_rows
	DO
		SELECT UserName INTO _UserAsal
		FROM temp_user
		LIMIT 1 OFFSET _counter;

		SELECT Nominal INTO _SaldoAwalUserAsal
		FROM Saldo
		WHERE UserName = _UserAsal;
		SET _SaldoAkhirUserAsal = 0;

		SELECT Nominal INTO _SaldoAwalUserTujuan
		FROM Saldo
		WHERE UserName = _UserName;
		SET _SaldoAkhirUserTujuan = _SaldoAwalUserAsal + _SaldoAwalUserTujuan;
		
		
		INSERT Transaksi
		(UserAsal, SaldoAkhirUserAsal, JumlahTransaksi, UserTujuan, SaldoAkhirUserTujuan, IdReq, created_at)
		VALUES
		(_UserAsal, _SaldoAkhirUserAsal, _SaldoAwalUserAsal, _UserName, _SaldoAkhirUserTujuan, -2, NOW());
		
		SET _idTransaksi = LAST_INSERT_ID();
		
		
		UPDATE Saldo 
		SET Nominal = _SaldoAkhirUserAsal, lastIdTransaksi = _idTransaksi
		WHERE UserName = _UserAsal;
		
		UPDATE Saldo 
		SET Nominal = _SaldoAkhirUserTujuan, lastIdTransaksi = _idTransaksi
		WHERE UserName = _UserName;
		
		SET _counter = _counter + 1;
	END while;
	
	DROP TEMPORARY TABLE if EXISTS temp_user;
END//
DELIMITER ;

-- Dumping structure for procedure kantin.SP_TambahinSaldoRole
DELIMITER //
CREATE PROCEDURE `SP_TambahinSaldoRole`(
	IN `_RoleID` INT,
	IN `_UserName` VARCHAR(255),
	IN `_Nominal` DECIMAL(19,4)
)
BEGIN

	DECLARE _UserTujuan VARCHAR(255);
	
	DECLARE _SaldoAwalUserAsal DECIMAL(19,4);
	DECLARE _SaldoAkhirUserAsal DECIMAL(19,4);
	
	DECLARE _SaldoAwalUserTujuan DECIMAL(19,4);
	DECLARE _SaldoAkhirUserTujuan DECIMAL(19,4);
	
	DECLARE _idTransaksi BIGINT;

	DECLARE _counter INT DEFAULT 0;
	DECLARE _total_rows INT;
	
	CREATE TEMPORARY TABLE temp_user AS
	SELECT UserName from user WHERE RoleID = _RoleID AND IsAktif = 1;

	SELECT COUNT(1) INTO _total_rows FROM temp_user;
	while _counter < _total_rows
	DO
		SELECT UserName INTO _UserTujuan
		FROM temp_user
		LIMIT 1 OFFSET _counter;

		SELECT Nominal INTO _SaldoAwalUserAsal
		FROM Saldo
		WHERE UserName = _UserName;
		SET _SaldoAkhirUserAsal = _SaldoAwalUserAsal - _Nominal;

		SELECT Nominal INTO _SaldoAwalUserTujuan
		FROM Saldo
		WHERE UserName = _UserTujuan;
		SET _SaldoAkhirUserTujuan = _SaldoAwalUserTujuan + _Nominal;
		
		
		INSERT Transaksi
		(UserAsal, SaldoAkhirUserAsal, JumlahTransaksi, UserTujuan, SaldoAkhirUserTujuan, IdReq, created_at)
		VALUES
		(_UserName, _SaldoAkhirUserAsal, _Nominal, _UserTujuan, _SaldoAkhirUserTujuan, -1, NOW());
		
		SET _idTransaksi = LAST_INSERT_ID();
		
		
		UPDATE Saldo 
		SET Nominal = _SaldoAkhirUserAsal, lastIdTransaksi = _idTransaksi
		WHERE UserName = _UserName;
		
		UPDATE Saldo 
		SET Nominal = _SaldoAkhirUserTujuan, lastIdTransaksi = _idTransaksi
		WHERE UserName = _UserTujuan;
		
		SET _counter = _counter + 1;
	END while;
	
	DROP TEMPORARY TABLE if EXISTS temp_user;
END//
DELIMITER ;

-- Dumping structure for table kantin.transaksi
CREATE TABLE IF NOT EXISTS `transaksi` (
  `idTransaksi` bigint NOT NULL AUTO_INCREMENT,
  `UserAsal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SaldoAkhirUserAsal` decimal(19,4) NOT NULL,
  `JumlahTransaksi` decimal(19,4) NOT NULL,
  `UserTujuan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SaldoAkhirUserTujuan` decimal(19,4) NOT NULL,
  `idReq` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`idTransaksi`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table kantin.transaksi: ~130 rows (approximately)
INSERT INTO `transaksi` (`idTransaksi`, `UserAsal`, `SaldoAkhirUserAsal`, `JumlahTransaksi`, `UserTujuan`, `SaldoAkhirUserTujuan`, `idReq`, `created_at`) VALUES
	(8, 'sa', -10000.0000, 10000.0000, 'BeliA', 10000.0000, -1, '2025-02-17 00:38:00'),
	(9, 'sa', -20000.0000, 10000.0000, 'BeliA', 20000.0000, NULL, '2025-02-17 10:02:15'),
	(10, 'sa', -30000.0000, 10000.0000, 'BeliA', 30000.0000, -1, '2025-02-17 10:02:52'),
	(13, 'sa', -40000.0000, 10000.0000, 'BeliA', 40000.0000, -1, '2025-02-17 10:04:46'),
	(14, 'BeliA', 30000.0000, 10000.0000, 'sa', -30000.0000, 1, '2025-02-17 12:05:49'),
	(15, 'BeliA', 20000.0000, 10000.0000, 'sa', -20000.0000, 1, '2025-02-17 13:13:05'),
	(16, 'BeliA', 10000.0000, 10000.0000, 'sa', -10000.0000, 1, '2025-02-17 13:13:38'),
	(17, 'BeliA', 0.0000, 10000.0000, 'sa', 0.0000, 1, '2025-02-17 13:14:50'),
	(18, 'sa', -1000000.0000, 1000000.0000, 'BeliA', 1000000.0000, -1, '2025-02-17 13:17:04'),
	(19, 'BeliA', 990000.0000, 10000.0000, 'JualA', 10000.0000, 3, '2025-02-17 13:17:40'),
	(20, 'BeliA', 980000.0000, 10000.0000, 'JualA', 20000.0000, 3, '2025-02-17 13:18:29'),
	(21, 'BeliA', 970000.0000, 10000.0000, 'JualA', 30000.0000, 5, '2025-02-17 17:22:07'),
	(22, 'BeliA', 945000.0000, 25000.0000, 'JualA', 55000.0000, 6, '2025-02-17 17:25:10'),
	(23, 'sa', -1010000.0000, 10000.0000, 'BeliA', 955000.0000, -1, '2025-02-17 17:37:04'),
	(24, 'BeliA', 953000.0000, 2000.0000, 'JualA', 57000.0000, 7, '2025-02-18 11:53:46'),
	(25, 'sa', -1011000.0000, 1000.0000, 'BeliA', 954000.0000, -1, '2025-02-23 20:56:17'),
	(26, 'sa', -1012000.0000, 1000.0000, 'BeliA', 955000.0000, -1, '2025-02-23 20:57:06'),
	(27, 'sa', -1013000.0000, 1000.0000, 'BeliA', 956000.0000, -1, '2025-02-23 20:57:37'),
	(28, 'BeliA', 0.0000, 956000.0000, 'sa', -57000.0000, -2, '2025-02-23 21:10:30'),
	(29, 'JualA', 0.0000, 57000.0000, 'sa', 0.0000, -2, '2025-02-24 10:41:44'),
	(30, 'sa', -10000.0000, 10000.0000, 'JualA', 10000.0000, -1, '2025-02-26 11:23:20'),
	(31, 'sa', -20000.0000, 10000.0000, 'JualA', 20000.0000, -1, '2025-02-26 11:24:32'),
	(32, 'sa', -30000.0000, 10000.0000, 'JualA', 30000.0000, -1, '2025-02-26 11:24:46'),
	(33, 'sa', -40000.0000, 10000.0000, 'JualA', 40000.0000, -1, '2025-02-26 11:26:08'),
	(34, 'JualA', 0.0000, 40000.0000, 'sa', 0.0000, -2, '2025-02-26 11:26:43'),
	(35, 'sa', -10000.0000, 10000.0000, 'BeliA', 10000.0000, -1, '2025-02-26 11:27:31'),
	(36, 'sa', -110000.0000, 100000.0000, 'BeliA', 110000.0000, -1, '2025-02-26 11:28:41'),
	(37, 'sa', -150000.0000, 40000.0000, 'BeliA', 150000.0000, -1, '2025-02-26 11:28:48'),
	(38, 'BeliA', 0.0000, 150000.0000, 'sa', 0.0000, -2, '2025-02-26 11:28:54'),
	(39, 'BeliA', -10.0000, 10.0000, 'sa', 10.0000, -2, '2025-02-26 11:29:26'),
	(40, 'sa', 0.0000, 10.0000, 'BeliA', 0.0000, -1, '2025-02-26 11:29:32'),
	(41, 'sa', -10000.0000, 10000.0000, 'beliC', 10000.0000, -1, '2025-02-26 11:32:46'),
	(42, 'sa', -110000.0000, 100000.0000, 'beliC', 110000.0000, -1, '2025-02-26 11:32:58'),
	(43, 'beliC', 0.0000, 110000.0000, 'sa', 0.0000, -2, '2025-02-26 11:33:22'),
	(44, 'sa', -10000.0000, 10000.0000, 'beliD', 10000.0000, -1, '2025-02-26 11:34:26'),
	(45, 'sa', -110000.0000, 100000.0000, 'beliD', 110000.0000, -1, '2025-02-26 11:34:32'),
	(46, 'beliD', 0.0000, 110000.0000, 'sa', 0.0000, -2, '2025-02-26 11:34:51'),
	(47, 'sa', -150000.0000, 150000.0000, 'beliD', 150000.0000, -1, '2025-02-26 11:34:58'),
	(48, '0', -150000.0000, 150000.0000, 'sa', 0.0000, -3, '2025-02-26 16:32:03'),
	(49, '0', -151000.0000, 151000.0000, 'sa', 151000.0000, -3, '2025-02-26 16:32:41'),
	(50, '0', -151000.0000, 151000.0000, 'sa', 302000.0000, -3, '2025-02-26 16:32:54'),
	(51, '0', 0.0000, 0.0000, 'sa', 302000.0000, -3, '2025-02-26 16:36:28'),
	(52, '0', -98000.0000, 98000.0000, 'sa', 400000.0000, -3, '2025-02-26 16:40:01'),
	(53, '0', 100000.0000, -100000.0000, 'sa', 300000.0000, -3, '2025-02-26 16:41:37'),
	(54, '0', 100000.0000, -100000.0000, 'sa', 200000.0000, -3, '2025-02-26 16:42:32'),
	(55, '0', -200001.0000, 200001.0000, 'sa', 400001.0000, -3, '2025-02-26 16:43:33'),
	(56, '0', -200002.0000, 200002.0000, 'sa', 600003.0000, -3, '2025-02-26 16:44:13'),
	(57, '0', 400003.0000, -400003.0000, 'sa', 200000.0000, -3, '2025-02-26 16:44:26'),
	(58, 'sa', 190000.0000, 10000.0000, 'JualA', 10000.0000, -1, '2025-02-27 10:58:21'),
	(59, 'JualA', 0.0000, 0.0000, 'sa', 200000.0000, -2, '2025-02-27 10:58:38'),
	(60, 'sa', 190000.0000, 10000.0000, 'JualA', 10000.0000, -1, '2025-02-27 11:07:07'),
	(61, 'JualA', 0.0000, 10000.0000, 'sa', 200000.0000, -2, '2025-02-27 11:07:14'),
	(62, 'JualA', 0.0000, 0.0000, 'sa', 200000.0000, -2, '2025-02-27 11:07:14'),
	(63, 'sa', 180000.0000, 20000.0000, 'JualA', 20000.0000, -1, '2025-02-27 11:08:13'),
	(64, 'JualA', 0.0000, 20000.0000, 'sa', 200000.0000, -2, '2025-02-27 11:08:19'),
	(65, 'sa', 190000.0000, 10000.0000, 'JualA', 10000.0000, -2, '2025-02-27 11:13:12'),
	(66, 'sa', 180000.0000, 10000.0000, 'BeliA', 10000.0000, -2, '2025-02-27 11:13:32'),
	(67, 'sa', 170000.0000, 10000.0000, 'BeliB', 10000.0000, -2, '2025-02-27 11:13:32'),
	(68, 'sa', 160000.0000, 10000.0000, 'beliC', 10000.0000, -2, '2025-02-27 11:13:32'),
	(69, 'sa', 150000.0000, 10000.0000, 'beliD', 160000.0000, -2, '2025-02-27 11:13:32'),
	(70, 'BeliA', 0.0000, 10000.0000, 'sa', 160000.0000, -2, '2025-02-27 12:02:54'),
	(71, 'BeliB', 0.0000, 10000.0000, 'sa', 170000.0000, -2, '2025-02-27 12:02:54'),
	(72, 'beliC', 0.0000, 10000.0000, 'sa', 180000.0000, -2, '2025-02-27 12:02:54'),
	(73, 'beliD', 0.0000, 160000.0000, 'sa', 340000.0000, -2, '2025-02-27 12:02:54'),
	(74, 'sa', 328889.0000, 11111.0000, 'BeliA', 11111.0000, -2, '2025-02-27 12:05:46'),
	(75, 'sa', 317778.0000, 11111.0000, 'BeliB', 11111.0000, -2, '2025-02-27 12:05:46'),
	(76, 'sa', 306667.0000, 11111.0000, 'beliC', 11111.0000, -2, '2025-02-27 12:05:46'),
	(77, 'sa', 295556.0000, 11111.0000, 'beliD', 11111.0000, -2, '2025-02-27 12:05:46'),
	(78, 'BeliA', 0.0000, 11111.0000, 'sa', 306667.0000, -2, '2025-02-27 12:06:32'),
	(79, 'BeliB', 0.0000, 11111.0000, 'sa', 317778.0000, -2, '2025-02-27 12:06:32'),
	(80, 'beliC', 0.0000, 11111.0000, 'sa', 328889.0000, -2, '2025-02-27 12:06:32'),
	(81, 'beliD', 0.0000, 11111.0000, 'sa', 340000.0000, -2, '2025-02-27 12:06:32'),
	(82, 'sa', 330000.0000, 10000.0000, 'BeliA', 10000.0000, -1, '2025-02-27 12:06:35'),
	(83, 'sa', 320000.0000, 10000.0000, 'BeliB', 10000.0000, -1, '2025-02-27 12:06:35'),
	(84, 'sa', 310000.0000, 10000.0000, 'beliC', 10000.0000, -1, '2025-02-27 12:06:35'),
	(85, 'sa', 300000.0000, 10000.0000, 'beliD', 10000.0000, -1, '2025-02-27 12:06:35'),
	(86, 'BeliA', 0.0000, 10000.0000, 'sa', 310000.0000, -2, '2025-02-27 12:06:51'),
	(87, 'BeliB', 0.0000, 10000.0000, 'sa', 320000.0000, -2, '2025-02-27 12:06:51'),
	(88, 'beliC', 0.0000, 10000.0000, 'sa', 330000.0000, -2, '2025-02-27 12:06:51'),
	(89, 'beliD', 0.0000, 10000.0000, 'sa', 340000.0000, -2, '2025-02-27 12:06:51'),
	(90, 'sa', 320000.0000, 20000.0000, 'BeliA', 20000.0000, -1, '2025-02-27 12:07:28'),
	(91, 'sa', 300000.0000, 20000.0000, 'BeliB', 20000.0000, -1, '2025-02-27 12:07:28'),
	(92, 'sa', 280000.0000, 20000.0000, 'beliC', 20000.0000, -1, '2025-02-27 12:07:28'),
	(93, 'sa', 260000.0000, 20000.0000, 'beliD', 20000.0000, -1, '2025-02-27 12:07:28'),
	(94, 'BeliA', 0.0000, 20000.0000, 'sa', 280000.0000, -2, '2025-02-27 12:07:30'),
	(95, 'BeliB', 0.0000, 20000.0000, 'sa', 300000.0000, -2, '2025-02-27 12:07:30'),
	(96, 'beliC', 0.0000, 20000.0000, 'sa', 320000.0000, -2, '2025-02-27 12:07:30'),
	(97, 'beliD', 0.0000, 20000.0000, 'sa', 340000.0000, -2, '2025-02-27 12:07:30'),
	(98, 'sa', 330000.0000, 10000.0000, 'JualA', 20000.0000, -1, '2025-02-27 15:22:37'),
	(99, 'sa', 320000.0000, 10000.0000, 'penjualB', 10000.0000, -1, '2025-02-27 15:22:37'),
	(100, 'JualA', 0.0000, 20000.0000, 'sa', 340000.0000, -2, '2025-02-27 15:22:44'),
	(101, 'penjualB', 0.0000, 10000.0000, 'sa', 350000.0000, -2, '2025-02-27 15:22:44'),
	(102, '0', 30000.0000, -30000.0000, 'sa', 320000.0000, -3, '2025-02-27 15:23:04'),
	(103, '0', 20000.0000, -20000.0000, 'sa', 300000.0000, -3, '2025-02-27 15:24:22'),
	(104, '0', 10000.0000, -10000.0000, 'sa', 290000.0000, -3, '2025-02-27 15:26:36'),
	(106, '0', -10000.0000, 10000.0000, 'sa', 300000.0000, -3, '2025-02-27 15:30:40'),
	(107, '0', 290000.0000, -290000.0000, 'sa', 10000.0000, -3, '2025-02-27 15:30:52'),
	(108, 'sa', 0.0000, 10000.0000, 'JualA', 10000.0000, -1, '2025-02-27 15:31:52'),
	(109, 'sa', -10000.0000, 10000.0000, 'penjualB', 10000.0000, -1, '2025-02-27 15:31:52'),
	(110, 'sa', -20000.0000, 10000.0000, 'PenjualC', 10000.0000, -1, '2025-02-27 15:31:52'),
	(111, 'JualA', 0.0000, 10000.0000, 'sa', -10000.0000, -2, '2025-02-27 15:31:55'),
	(112, 'penjualB', 0.0000, 10000.0000, 'sa', 0.0000, -2, '2025-02-27 15:31:55'),
	(113, 'PenjualC', 0.0000, 10000.0000, 'sa', 10000.0000, -2, '2025-02-27 15:31:55'),
	(114, 'sa', 0.0000, 10000.0000, 'penjualB', 10000.0000, -1, '2025-02-27 15:32:09'),
	(115, 'sa', -100000.0000, 100000.0000, 'JualA', 100000.0000, -1, '2025-02-27 16:16:20'),
	(116, 'sa', -200000.0000, 100000.0000, 'penjualB', 110000.0000, -1, '2025-02-27 16:16:20'),
	(117, 'sa', -300000.0000, 100000.0000, 'PenjualC', 100000.0000, -1, '2025-02-27 16:16:20'),
	(118, 'sa', -400000.0000, 100000.0000, 'penjualD', 100000.0000, -1, '2025-02-27 16:16:20'),
	(119, 'JualA', 0.0000, 100000.0000, 'sa', -300000.0000, -2, '2025-02-27 16:16:27'),
	(120, 'penjualB', 0.0000, 110000.0000, 'sa', -190000.0000, -2, '2025-02-27 16:16:27'),
	(121, 'PenjualC', 0.0000, 100000.0000, 'sa', -90000.0000, -2, '2025-02-27 16:16:27'),
	(122, 'penjualD', 0.0000, 100000.0000, 'sa', 10000.0000, -2, '2025-02-27 16:16:27'),
	(123, '0', -100000.0000, 100000.0000, 'sa', 110000.0000, -3, '2025-02-27 16:17:09'),
	(124, '0', -100000.0000, 100000.0000, 'sa', 210000.0000, -3, '2025-02-27 16:18:32'),
	(125, 'sa', 200000.0000, 10000.0000, 'JualA', 10000.0000, -1, '2025-02-27 16:22:06'),
	(126, 'sa', 190000.0000, 10000.0000, 'penjualB', 10000.0000, -1, '2025-02-27 16:22:06'),
	(127, 'sa', 180000.0000, 10000.0000, 'PenjualC', 10000.0000, -1, '2025-02-27 16:22:06'),
	(128, 'sa', 170000.0000, 10000.0000, 'penjualD', 10000.0000, -1, '2025-02-27 16:22:06'),
	(129, 'JualA', 0.0000, 10000.0000, 'sa', 180000.0000, -2, '2025-02-27 16:23:43'),
	(130, 'penjualB', 0.0000, 10000.0000, 'sa', 190000.0000, -2, '2025-02-27 16:23:43'),
	(131, 'PenjualC', 0.0000, 10000.0000, 'sa', 200000.0000, -2, '2025-02-27 16:23:43'),
	(132, 'penjualD', 0.0000, 10000.0000, 'sa', 210000.0000, -2, '2025-02-27 16:23:43'),
	(133, 'sa', 187000.0000, 23000.0000, 'penjualB', 23000.0000, -1, '2025-02-27 16:23:58'),
	(134, 'sa', 177000.0000, 10000.0000, 'BeliA', 10000.0000, -1, '2025-02-27 16:24:38'),
	(135, 'sa', 167000.0000, 10000.0000, 'BeliB', 10000.0000, -1, '2025-02-27 16:24:38'),
	(136, 'sa', 157000.0000, 10000.0000, 'beliC', 10000.0000, -1, '2025-02-27 16:24:38'),
	(137, 'sa', 147000.0000, 10000.0000, 'beliD', 10000.0000, -1, '2025-02-27 16:24:38'),
	(138, 'sa', 117000.0000, 30000.0000, 'BeliA', 40000.0000, -1, '2025-02-27 16:24:47'),
	(139, 'BeliA', 0.0000, 40000.0000, 'sa', 157000.0000, -2, '2025-02-27 16:25:04'),
	(140, 'BeliB', 0.0000, 10000.0000, 'sa', 167000.0000, -2, '2025-02-27 16:25:04'),
	(141, 'beliC', 0.0000, 10000.0000, 'sa', 177000.0000, -2, '2025-02-27 16:25:04'),
	(142, 'beliD', 0.0000, 10000.0000, 'sa', 187000.0000, -2, '2025-02-27 16:25:04'),
	(143, 'sa', 177000.0000, 10000.0000, 'BeliA', 10000.0000, -1, '2025-02-27 16:26:04'),
	(144, 'sa', 167000.0000, 10000.0000, 'BeliB', 10000.0000, -1, '2025-02-27 16:26:04'),
	(145, 'sa', 157000.0000, 10000.0000, 'beliC', 10000.0000, -1, '2025-02-27 16:26:04'),
	(146, 'sa', 147000.0000, 10000.0000, 'beliD', 10000.0000, -1, '2025-02-27 16:26:04'),
	(147, 'sa', 137000.0000, 10000.0000, 'BeliA', 20000.0000, -1, '2025-02-27 16:26:15'),
	(148, 'BeliA', 0.0000, 20000.0000, 'sa', 157000.0000, -2, '2025-02-27 16:26:27'),
	(149, 'BeliB', 0.0000, 10000.0000, 'sa', 167000.0000, -2, '2025-02-27 16:26:27'),
	(150, 'beliC', 0.0000, 10000.0000, 'sa', 177000.0000, -2, '2025-02-27 16:26:27'),
	(151, 'beliD', 0.0000, 10000.0000, 'sa', 187000.0000, -2, '2025-02-27 16:26:27'),
	(152, '0', -13000.0000, 13000.0000, 'sa', 200000.0000, -3, '2025-02-27 16:26:49'),
	(153, '0', -100000.0000, 100000.0000, 'sa', 300000.0000, -3, '2025-02-28 10:00:28'),
	(154, 'sa', 290000.0000, 10000.0000, 'beliD', 10000.0000, -1, '2025-03-02 15:30:00'),
	(155, 'sa', 289000.0000, 1000.0000, 'BeliA', 1000.0000, -1, '2025-03-02 16:07:32'),
	(156, 'sa', 288000.0000, 1000.0000, 'BeliB', 1000.0000, -1, '2025-03-02 16:07:32'),
	(157, 'sa', 287000.0000, 1000.0000, 'beliC', 1000.0000, -1, '2025-03-02 16:07:32'),
	(158, 'sa', -713000.0000, 1000000.0000, 'JualA', 1000000.0000, -1, '2025-03-05 14:47:36'),
	(159, 'sa', -1713000.0000, 1000000.0000, 'BeliA', 1001000.0000, -1, '2025-03-05 14:48:06'),
	(160, 'BeliA', 999000.0000, 2000.0000, 'JualA', 1002000.0000, 9, '2025-03-05 14:48:15');

-- Dumping structure for table kantin.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PIN` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RoleID` tinyint NOT NULL,
  `UserInput` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `IsAktif` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `Failed_login` int DEFAULT NULL,
  `Failed_PIN` int DEFAULT NULL,
  `TokenSign` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Last_Login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserName` (`UserName`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table kantin.user: ~9 rows (approximately)
INSERT INTO `user` (`id`, `Name`, `UserName`, `Password`, `PIN`, `RoleID`, `UserInput`, `IsAktif`, `created_at`, `updated_at`, `Failed_login`, `Failed_PIN`, `TokenSign`, `Last_Login`) VALUES
	(1, 'sup admin', 'sa', '752af3b68879407de5037128cefb97e09eb86dee29577eedaee0dc4caa9c1a05', NULL, 0, 'sa', 1, '2025-02-09 21:32:04', '2025-02-09 21:32:04', 0, NULL, 'xPowrCCp8zQ4HfZJoJjRkD8NdgNBa_aGdPOFhO9PL1o', '2025-03-05 07:45:10'),
	(8, 'Pembeli a', 'BeliA', 'b30fa2fca2d6b97b2aa79fd40d77740f5718996d2dd5ffbb50e79c1d2bd189e7', 'e7d24dc3070866feb35de0f0ec031329988891e9fd147a4aa8227b6c768e5950', 2, 'BeliA', 1, '2025-02-13 10:24:40', '2025-02-17 10:16:22', 0, 0, 'w0sHALGf3KImEYvlM421J8kjCpY9Yk4s_rsaTkLg3y4', '2025-03-05 07:47:18'),
	(12, 'Penjual a', 'JualA', 'afcde69d32a52d0adbfa446049015ddd79c9b67b21c12c6d456c995477626f50', NULL, 1, 'sa', 1, '2025-02-16 16:19:23', '2025-02-16 16:19:23', 0, 0, 'oEsTX4XacjF2e4aYey3tB5eOCDD6aJ-L9yCL-hAozJI', '2025-03-05 07:50:21'),
	(15, 'Pembeli B', 'BeliB', 'fb16df4c5e08d29eb2a55b68f8dbd810febfd9edcf4276d05dc830ad00951a49', NULL, 2, 'sa', 1, '2025-02-26 04:03:29', '2025-02-26 04:03:29', 0, NULL, '', NULL),
	(20, 'pembeli user c', 'beliC', '3a9a64d53c747f8f35c366f5b7b54d28103138efdb9d712daf80d9ce0098b64e', NULL, 2, 'sa', 1, '2025-02-26 04:32:37', '2025-02-26 04:32:37', 0, NULL, '', NULL),
	(21, 'pembeli user D', 'beliD', '6bdd7e54d084989defb161d306f722352adfd81938ba5090e27c24c2eec78073', NULL, 2, 'sa', 0, '2025-02-26 04:34:15', '2025-03-02 08:49:07', 0, 0, '', NULL),
	(25, 'jual B', 'penjualB', 'e0bf2a8c6b58ffa079f73cafa21b7fb1f17494f039ec47b70d6167ec656c8f2e', NULL, 1, 'sa', 1, '2025-02-27 08:22:24', '2025-02-27 08:22:24', 0, NULL, '', NULL),
	(26, 'jual C', 'PenjualC', '731f780d00cf907180f381a73858d1ed5fe69a3032fe4aad1438963327e954ce', NULL, 1, 'sa', 1, '2025-02-27 08:31:45', '2025-02-27 08:31:45', 0, NULL, '', NULL),
	(27, 'jual D', 'penjualD', '062243768f939132c3b71a0443ddc8e9fdda1bb9bc036f16ba858f4c76e653bf', NULL, 1, 'sa', 1, '2025-02-27 09:16:10', '2025-02-27 09:16:10', 0, NULL, '', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
