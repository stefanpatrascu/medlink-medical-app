package com.medical.app.user.dto;

import com.medical.app.employee.dto.WorkProgramWeekDTO;
import com.medical.app.employee.enums.EmployeeType;
import com.medical.app.employee.enums.SpecializationEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeDTO {
  @Valid
  @NotNull
  @NotEmpty
  @Size(min = 1, max = 7)
  List<WorkProgramWeekDTO> workProgramWeek;

  @NotBlank
  private String hireDate;

  @NotNull
  private EmployeeType employeeType;

  @NotNull
  private SpecializationEnum specialization;

  @NotNull
  private Long clinicId;
}
