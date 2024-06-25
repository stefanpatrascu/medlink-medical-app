package com.medical.app.account.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginAttemptsDTO {
  private String ipAddress;
  private LocalDateTime lastAttempt;
}
