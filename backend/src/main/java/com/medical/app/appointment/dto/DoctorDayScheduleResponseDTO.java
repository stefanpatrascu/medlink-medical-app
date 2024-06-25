package com.medical.app.appointment.dto;

import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DoctorDayScheduleResponseDTO {
  private String date;
  private LocalTime startTime;
  private LocalTime endTime;
}
