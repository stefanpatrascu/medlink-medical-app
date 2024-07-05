package com.medical.app.account.service.impl;

import com.medical.app.account.dto.record.MyAccountRecord;
import com.medical.app.account.service.AccountService;
import com.medical.app.exception.ForbiddenException;
import com.medical.app.exception.NotFoundException;
import com.medical.app.logs.enums.LogActionEnum;
import com.medical.app.logs.service.impl.LogServiceImpl;
import com.medical.app.security.JwtService;
import com.medical.app.user.entity.User;
import com.medical.app.user.service.impl.UserServiceImpl;
import com.medical.app.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AccountServiceImpl implements AccountService {

  private final UserServiceImpl userService;
  private final JwtService jwtService;
  private final LogServiceImpl logService;

  public ResponseEntity<MyAccountRecord> getAccountDetails(UserDetails currentUser) {
    User user = userService.getUserByEmail(currentUser.getUsername());
    if (user == null) {
      throw new NotFoundException("User not found");
    }
    return ResponseEntity.ok(new MyAccountRecord(
        user.getId(),
        user.getEmail(),
        user.getFullName(),
        user.getFirstName(),
        user.getLastName(),
        user.getRoles().stream().map(role -> role.getRole().toString()).toList()
    ));
  }

  public ResponseEntity<ApiResponse> refresh(HttpServletRequest request, HttpServletResponse response) {

    final String token = jwtService.extractTokenFromCookies(request);
    final String username = jwtService.extractUsername(token, true);

    if (token == null || username == null) {
      logService.addLog(LogActionEnum.INVALID_REFRESH_TOKEN, "Invalid token");
      throw new ForbiddenException("Invalid token");
    }

    final User userDetails = userService.getUserByEmail(username);
    if (userDetails == null || !username.equals(userDetails.getEmail())) {
      logService.addLog(LogActionEnum.FAILED_TO_REFRESH_SESSION, "User not found");
      throw new ForbiddenException("User not found");
    }

    if (!userDetails.isEnabled()) {
      logService.addLog(LogActionEnum.FAILED_TO_REFRESH_SESSION, "User is disabled");
      throw new ForbiddenException("User is disabled");
    }

    final LocalDateTime lastLogin = userDetails.getLastLogin();

    if (lastLogin == null) {
      logService.addLog(LogActionEnum.FAILED_TO_REFRESH_SESSION, "User needs to login first");
      throw new ForbiddenException("You need to login first");
    }

    /**
     * After 12 hours, the user needs to login again
     */
    if (lastLogin.plusHours(12).isBefore(LocalDateTime.now())) {
      logService.addLog(LogActionEnum.SESSION_EXPIRED_AFTER_12_HOURS, "Session expired for user with email: " + userDetails.getEmail());
      throw new ForbiddenException("Session expired");
    }

    /**
     * If the token is expired, generate a new token and save it in the cookie
     */
    if (jwtService.isTokenExpired(token)) {
      String newToken = jwtService.generateToken(userDetails);
      jwtService.saveJwtCookie(response, newToken);
    }

    logService.addLog(LogActionEnum.SESSION_REFRESHED, "Session refreshed for user with email: " + userDetails.getEmail());

    return ApiResponse.ok("OK");
  }
}
