package com.medical.app.clinics.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class AddClinicDTO {
  @NotEmpty
  @Length(min = 3, max = 30)
  private String clinicName;

}
