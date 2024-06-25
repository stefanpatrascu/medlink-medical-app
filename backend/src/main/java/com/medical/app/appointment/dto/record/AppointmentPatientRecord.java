package com.medical.app.appointment.dto.record;

public record AppointmentPatientRecord(
    Long id,
    String fullName,
    String email,
    String phoneNumber,
    String dateOfBirth,
    String cnp) {
}