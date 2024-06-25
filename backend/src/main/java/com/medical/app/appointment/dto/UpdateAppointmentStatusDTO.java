package com.medical.app.appointment.dto;

import com.medical.app.appointment.enums.AppointmentStatusEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAppointmentStatusDTO {

  @NotNull
  private AppointmentStatusEnum status;

}
