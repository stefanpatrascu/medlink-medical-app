CREATE TABLE employees
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    hire_date       DATE,
    employee_type   VARCHAR(50),
    specialization  VARCHAR(50),
    user_id         BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
