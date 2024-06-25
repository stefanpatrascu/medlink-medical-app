package com.medical.app.account.service.impl;

import com.medical.app.account.dto.LoginAttemptsDTO;
import com.medical.app.account.service.LockAccountService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LockAccountServiceImpl implements LockAccountService {

  @Value("${security.max-login-attempts}")
  private int maxAttempts;

  @Value("${security.lock-login-time}")
  private int clearAfterMinutes;

  private final List<LoginAttemptsDTO> loginAttempts = new ArrayList<>();

  public void addLoginAttempt(String ip) {
    LoginAttemptsDTO loginAttempt = new LoginAttemptsDTO();
    loginAttempt.setIpAddress(ip);
    loginAttempt.setLastAttempt(LocalDateTime.now());
    loginAttempts.add(loginAttempt);
  }

  public boolean isAccountLocked(String ip) {
    return loginAttempts.stream().filter(loginAttempt -> loginAttempt.getIpAddress().equals(ip)).count() >= maxAttempts;
  }

  public void clearOldLoginAttempts() {
    loginAttempts.removeIf(loginAttempt -> loginAttempt.getLastAttempt()
        .isBefore(LocalDateTime.now().minusMinutes(clearAfterMinutes)));
  }
}
