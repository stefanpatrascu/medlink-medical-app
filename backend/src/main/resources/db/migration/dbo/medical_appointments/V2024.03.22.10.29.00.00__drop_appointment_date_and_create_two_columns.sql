ALTER TABLE medical_appointments
    DROP COLUMN appointment_date;

ALTER TABLE medical_appointments
    ADD appointment_start_date DATETIME NOT NULL;

ALTER TABLE medical_appointments
    ADD appointment_end_date DATETIME NOT NULL;
