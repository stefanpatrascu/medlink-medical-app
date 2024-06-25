CREATE TABLE users
(
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    email               VARCHAR(100) NOT NULL UNIQUE,
    password            VARCHAR(255) NOT NULL,
    authorities         VARCHAR(100) NOT NULL,
    enabled             BIT NOT NULL DEFAULT b'1'
);
