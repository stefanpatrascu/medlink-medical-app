ALTER TABLE employees
    ADD clinic_id BIGINT NOT NULL DEFAULT 1,
        ADD CONSTRAINT fk_employee_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id);
