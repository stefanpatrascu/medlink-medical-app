package com.medical.app.account.controller;

import com.medical.app.account.dto.RegisterUserDTO;
import com.medical.app.account.service.impl.RegisterServiceImpl;
import com.medical.app.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@AllArgsConstructor
@RequestMapping("/register")
@RestController
public class RegisterController {

  private final RegisterServiceImpl registerServiceImpl;

  @PostMapping
  public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
    return registerServiceImpl.register(registerUserDTO);
  }

}
