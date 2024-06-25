package com.medical.app.account.service;

import com.medical.app.account.dto.LoginUserDTO;
import com.medical.app.account.dto.record.MyAccountRecord;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface LoginService {
  ResponseEntity<MyAccountRecord> login(HttpServletResponse response, LoginUserDTO loginRequest);
}
