package com.medical.app.account.controller;

import com.medical.app.account.dto.LoginUserDTO;
import com.medical.app.account.dto.record.MyAccountRecord;
import com.medical.app.account.service.impl.LoginServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/login")
@AllArgsConstructor
public class LoginController {

  private final LoginServiceImpl loginService;

  @PostMapping
  public ResponseEntity<MyAccountRecord> login(HttpServletResponse response, @Valid @RequestBody LoginUserDTO loginUserDTO) {
    return loginService.login(response, loginUserDTO);
  }

}
