ALTER TABLE medical_appointments
    ADD doctor_user_id BIGINT NOT NULL,
        ADD CONSTRAINT fk_doctor_user_id FOREIGN KEY (doctor_user_id) REFERENCES users(id);

ALTER TABLE medical_appointments
    ADD created_by BIGINT NOT NULL,
        ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE medical_appointments
    ADD last_updated_by BIGINT NOT NULL,
        ADD CONSTRAINT fk_last_updated_by FOREIGN KEY (last_updated_by) REFERENCES users(id);

ALTER TABLE medical_appointments
    ADD last_updated_date DATETIME NOT NULL;

ALTER TABLE medical_appointments
    ADD created_at DATETIME NOT NULL;

ALTER TABLE medical_appointments
    ADD doctor_notes VARCHAR(255);
