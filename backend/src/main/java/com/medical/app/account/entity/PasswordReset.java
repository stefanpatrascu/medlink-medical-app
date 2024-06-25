package com.medical.app.account.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "reset_password")
public class PasswordReset {

  @Id
  private String email;

  private String otp;

  private LocalDateTime resetDateTime;

}
