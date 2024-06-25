package com.medical.app.appointment.dto.record;

import com.medical.app.appointment.enums.AppointmentStatusEnum;

public record MyAppointmentsRecord(
    Long id,
    String appointmentStartDate,
    String appointmentEndDate,
    AppointmentStatusEnum status,
    String clinicName,
    Long clinicId,
    String doctorFullName,
    Long doctorId,
    String createdAt
) {


}
