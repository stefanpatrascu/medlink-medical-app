package com.medical.app.user.dto;

import com.medical.app.user.enums.RoleEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class UpdateUserDTO {

  private String prefix;

  @NotBlank
  @Length(min = 3, max = 30)
  private String firstName;

  @NotBlank
  @Length(min = 3, max = 30)
  private String lastName;

  @Email
  @Length(max = 255)
  private String email;

  @Length(min = 6, max = 32)
  private String password;

  @NotNull
  private Boolean enabled;

  @Length(max = 13)
  @NotEmpty
  private String cnp;

  @NotBlank
  private String dateOfBirth;

  @NotBlank
  @Length(min = 3, max = 15)
  private String phoneNumber;

  @NotNull
  private List<RoleEnum> roles;

  @Valid
  private EmployeeDTO employee;

  @Valid
  private Boolean isEmployee;
}
