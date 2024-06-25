package com.medical.app.appointment.dto;

import com.medical.app.appointment.enums.AppointmentStatusEnum;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAppointmentDTO {

  @NotNull
  private String appointmentStartDate;

  @NotNull
  private String appointmentEndDate;

  @NotNull
  @Min(value = 0L, message = "The value must be positive")
  private Long clinicId;

  @NotNull
  @Min(value = 0L, message = "The value must be positive")
  private Long doctorId;

  @Min(value = 0L, message = "The value must be positive")
  private Long patientId;

  private AppointmentStatusEnum status;

}
