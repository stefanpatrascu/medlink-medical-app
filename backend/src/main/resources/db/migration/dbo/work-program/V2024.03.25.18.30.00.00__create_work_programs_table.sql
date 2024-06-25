CREATE TABLE work_programs
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    day         VARCHAR(30),
    start_time  TIME,
    end_time    TIME,
    CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id)
);
