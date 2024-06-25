UPDATE medical_appointments
SET appointment_status = 'REQUESTED'
WHERE appointment_status = 'PENDING';
