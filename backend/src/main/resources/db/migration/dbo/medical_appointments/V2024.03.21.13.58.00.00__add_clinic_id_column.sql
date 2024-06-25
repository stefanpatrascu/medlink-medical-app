ALTER TABLE medical_appointments
    ADD clinic_id BIGINT NOT NULL,
        ADD CONSTRAINT fk_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id);
