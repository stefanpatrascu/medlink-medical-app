package com.medical.app.account.controller;

import com.medical.app.account.dto.ResetPasswordDTO;
import com.medical.app.account.dto.record.MyAccountRecord;
import com.medical.app.account.service.impl.AccountServiceImpl;
import com.medical.app.account.service.impl.ResetPasswordImpl;
import com.medical.app.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/account")
@AllArgsConstructor
public class AccountController {

  private final AccountServiceImpl accountServiceImpl;
  private final ResetPasswordImpl resetPasswordImpl;

  @GetMapping("/my-account")
  public ResponseEntity<MyAccountRecord> getMyAccount(@AuthenticationPrincipal UserDetails currentUser) {
    return accountServiceImpl.getAccountDetails(currentUser);
  }

  @PostMapping("/refresh")
  public ResponseEntity<ApiResponse> refresh(HttpServletRequest request, HttpServletResponse response) {
    return accountServiceImpl.refresh(request, response);
  }

  @PostMapping("/reset/send-reset-password-email")
  public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestParam("email") String email) {
    return resetPasswordImpl.sendResetPasswordEmail(email);
  }

  @PostMapping("/reset/change-password")
  public ResponseEntity<ApiResponse> changePassword(@Valid @RequestBody ResetPasswordDTO user) {
    return resetPasswordImpl.changePassword(user.getEmail(), user.getPassword(), user.getOtp());
  }

  @PostMapping("/reset/validate")
  public ResponseEntity<ApiResponse> checkIfEmailAndOtpExists(
      @Valid @RequestParam("email") String email,
      @Valid @RequestParam("otp") String otp) {
    return resetPasswordImpl.checkIfEmailAndOtpExists(email, otp);
  }
}
