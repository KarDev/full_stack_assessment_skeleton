DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `home`;

CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uniqueId` CHAR(36) NOT NULL UNIQUE,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `home` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uniqueId` CHAR(36) NOT NULL UNIQUE,
  `street_address` VARCHAR(255) NOT NULL UNIQUE,
  `state` VARCHAR(50) NOT NULL,
  `zip` VARCHAR(10) NOT NULL,
  `sqft` FLOAT NOT NULL,
  `beds` INT NOT NULL,
  `baths` INT NOT NULL,
  `list_price` FLOAT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_home_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `homeId` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_home` (`userId`, `homeId`), 
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`homeId`) REFERENCES `home`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user` (`username`, `email`, `uniqueId`)
SELECT `username`, `email`, UUID() as `uniqueId`
FROM (
    SELECT DISTINCT `username`, `email`
    FROM `user_home`
) AS unique_users;

INSERT INTO `home` (`street_address`, `state`, `zip`, `sqft`, `beds`, `baths`, `list_price`, `uniqueId`)
SELECT `street_address`, `state`, `zip`, `sqft`, `beds`, `baths`, `list_price`, UUID() as `uniqueId`
FROM (
    SELECT DISTINCT `street_address`, `state`, `zip`, `sqft`, `beds`, `baths`, `list_price`
    FROM `user_home`
) AS unique_homes;

INSERT INTO `user_home_map` (`userId`, `homeId`)
SELECT u.id, h.id
FROM (SELECT `username`, street_address FROM `user_home`) uh
JOIN `user` u ON u.username = uh.username 
JOIN `home` h ON h.street_address = uh.street_address;

DROP TABLE IF EXISTS `user_home`;
