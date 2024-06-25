package com.medical.app.appointment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class RescheduleAppointmentDTO {

  @NotNull
  private String appointmentStartDate;

  @NotNull
  private String appointmentEndDate;

}
