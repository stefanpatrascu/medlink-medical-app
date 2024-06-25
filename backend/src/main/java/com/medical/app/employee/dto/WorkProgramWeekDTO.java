package com.medical.app.employee.dto;

import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkProgramWeekDTO {

  @NotNull
  private DayOfWeek day;

  @NotNull
  private String startTime;

  @NotNull
  private String endTime;
}
