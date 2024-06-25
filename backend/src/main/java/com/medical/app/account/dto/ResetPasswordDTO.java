package com.medical.app.account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import org.hibernate.validator.constraints.Length;

@Getter
public class ResetPasswordDTO {
  @NotEmpty
  @Email
  private String email;

  @NotEmpty
  private String otp;

  @NotEmpty
  @Length(min = 6, max = 32)
  private String password;
}
