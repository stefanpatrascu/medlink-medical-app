package com.medical.app.account.service;

import com.medical.app.account.dto.RegisterUserDTO;
import com.medical.app.util.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface RegisterService {
  ResponseEntity<ApiResponse> register(RegisterUserDTO registerUserDTO);
}
