package com.medical.app.account.service.impl;

import com.medical.app.account.dto.LoginUserDTO;
import com.medical.app.account.dto.record.MyAccountRecord;
import com.medical.app.account.service.LoginService;
import com.medical.app.exception.ForbiddenException;
import com.medical.app.exception.ResourceLockedException;
import com.medical.app.exception.UnauthorizedException;
import com.medical.app.logs.enums.LogActionEnum;
import com.medical.app.logs.service.impl.LogServiceImpl;
import com.medical.app.security.JwtService;
import com.medical.app.user.entity.User;
import com.medical.app.user.repository.UserRepository;
import com.medical.app.user.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LoginServiceImpl implements LoginService {

  private final JwtService jwtService;
  private final LogServiceImpl logService;
  private final HttpServletRequest request;
  private final UserServiceImpl userService;
  private final UserRepository userRepository;
  private final LockAccountServiceImpl lockAccountService;
  private PasswordEncoder passwordEncoder;

  public ResponseEntity<MyAccountRecord> login(HttpServletResponse response, LoginUserDTO loginRequest) {

    final User user = userService.getUserByEmail(loginRequest.getEmail());

    if (lockAccountService.isAccountLocked(getClientIP())) {
      throw new ResourceLockedException("Too many login attempts. Account is locked");
    }

    if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
      lockAccountService.addLoginAttempt(getClientIP());

      logService.addLog(LogActionEnum.LOGIN_FAILED, "Login failed with email: " + loginRequest.getEmail());
      if (lockAccountService.isAccountLocked(getClientIP())) {
        logService.addLog(
            LogActionEnum.LIMIT_LOGIN_ATTEMPTS_EXCEEDED,
            "Account locked due to too many login attempts with email: " + loginRequest.getEmail());
      }

      throw new UnauthorizedException("Invalid email or password");
    }

    if (!user.isEnabled()) {
      throw new ForbiddenException("User is disabled");
    }

    user.setLastLogin(LocalDateTime.now());
    userRepository.save(user);

    String token = jwtService.generateToken(user);
    jwtService.saveJwtCookie(response, token);

    logService.addLog(LogActionEnum.LOGIN_SUCCESSFUL, "User logged in successfully with email: " + user.getEmail());

    return ResponseEntity.ok(new MyAccountRecord(
        user.getId(),
        user.getEmail(),
        user.getFullName(),
        user.getFirstName(),
        user.getLastName(),
        user.getRoles().stream().map(role -> role.getRole().toString()).toList()
    ));
  }

  private String getClientIP() {
    final String xfHeader = request.getHeader("X-Forwarded-For");
    if (xfHeader != null) {
      return xfHeader.split(",")[0];
    }
    return request.getRemoteAddr();
  }
}
