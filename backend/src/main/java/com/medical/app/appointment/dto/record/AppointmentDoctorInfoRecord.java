package com.medical.app.appointment.dto.record;

public record AppointmentDoctorInfoRecord(
    Long id,
    String fullName,
    String phoneNumber,
    String email,
    String speciality) {
}