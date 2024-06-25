package com.medical.app.account.service;

import com.medical.app.account.dto.record.MyAccountRecord;
import com.medical.app.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

public interface AccountService {
  ResponseEntity<MyAccountRecord> getAccountDetails(UserDetails currentUser);

  ResponseEntity<ApiResponse> refresh(HttpServletRequest request, HttpServletResponse response);
}
