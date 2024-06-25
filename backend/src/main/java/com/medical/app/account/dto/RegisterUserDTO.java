package com.medical.app.account.dto;

import com.medical.app.user.dto.CreateUserDTO;
import com.medical.app.user.dto.UpdateUserDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class RegisterUserDTO {

  @NotBlank
  @Length(min = 3, max = 30)
  private String firstName;

  @NotBlank
  @Length(min = 3, max = 30)
  private String lastName;

  @Email
  @Length(max = 120)
  private String email;

  @NotEmpty(groups = {RegisterUserDTO.class, CreateUserDTO.class, UpdateUserDTO.class})
  @Length(min = 6, max = 32)
  private String password;

  @Length(max = 13)
  @NotEmpty
  private String cnp;

  @NotBlank
  private String dateOfBirth;

  @NotBlank
  @Length(min = 3, max = 15)
  private String phoneNumber;

  @NotBlank
  @Length(min = 3, max = 30)
  private String city;

  @NotBlank
  @Length(min = 3, max = 50)
  private String county;

  @NotBlank
  @Length(min = 3, max = 30)
  private String country;

  @NotBlank
  @Length(min = 3, max = 10)
  private String postalCode;

  @NotBlank
  @Length(min = 3, max = 100)
  private String address;
}
