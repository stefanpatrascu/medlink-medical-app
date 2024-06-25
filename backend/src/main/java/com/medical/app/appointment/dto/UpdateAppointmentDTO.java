package com.medical.app.appointment.dto;

import com.medical.app.appointment.enums.AppointmentStatusEnum;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdateAppointmentDTO {

  private String observations;

  private String recommendations;

  private AppointmentStatusEnum status;

  private String appointmentStartDate;

  private String appointmentEndDate;

  @Min(value = 0L, message = "The value must be positive")
  private Long clinicId;

  @Min(value = 0L, message = "The value must be positive")
  private Long doctorId;

  @Min(value = 0L, message = "The value must be positive")
  private Long patientId;

}
