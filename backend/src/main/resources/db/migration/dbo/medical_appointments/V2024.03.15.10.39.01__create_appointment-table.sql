CREATE TABLE medical_appointments
(
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_date    DATETIME NOT NULL,
    appointment_type    VARCHAR(100) NOT NULL,
    appointment_status  VARCHAR(100) NOT NULL,
    patient_user_id     BIGINT NOT NULL,
    CONSTRAINT fk_patient_user_id FOREIGN KEY (patient_user_id) REFERENCES users(id)
);
