package com.medical.app.account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class LoginUserDTO {

  @NotEmpty
  @Email
  @Length(max = 100)
  private String email;

  @NotEmpty
  @Length(min = 6, max = 32)
  private String password;
}
