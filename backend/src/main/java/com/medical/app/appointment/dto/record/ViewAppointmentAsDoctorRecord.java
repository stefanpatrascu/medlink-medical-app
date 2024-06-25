package com.medical.app.appointment.dto.record;

import com.medical.app.appointment.enums.AppointmentStatusEnum;

public record ViewAppointmentAsDoctorRecord(
    Long id,
    AppointmentPatientRecord patient,
    AppointmentDoctorInfoRecord doctor,
    AppointmentClinicRecord clinic,
    String appointmentStartDate,
    String appointmentEndDate,
    AppointmentStatusEnum status,
    String lastUpdatedBy,
    String lastUpdatedAt,
    String createdAt,
    String recommendations,
    String observations) {

}
