package com.medical.app.account.service;

import com.medical.app.util.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface ResetPasswordService {

  ResponseEntity<ApiResponse> checkIfEmailAndOtpExists(String email, String otp);

  ResponseEntity<ApiResponse> sendResetPasswordEmail(String email);

  ResponseEntity<ApiResponse> changePassword(String email, String password, String otp);
}
