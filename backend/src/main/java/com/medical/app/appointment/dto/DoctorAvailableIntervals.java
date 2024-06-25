package com.medical.app.appointment.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class DoctorAvailableIntervals {

  private LocalDateTime startTime;
  private LocalDateTime endTime;
}
