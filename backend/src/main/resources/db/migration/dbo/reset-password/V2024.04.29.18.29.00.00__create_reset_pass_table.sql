CREATE TABLE reset_password(
    email         VARCHAR(255) NOT NULL,
    otp          VARCHAR(6)  NOT NULL,
    reset_date_time DATETIME     NOT NULL,
    PRIMARY KEY (email)
);
