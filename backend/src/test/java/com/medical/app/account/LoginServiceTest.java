package com.medical.app.account;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import com.medical.app.account.dto.LoginUserDTO;
import com.medical.app.account.dto.record.MyAccountRecord;
import com.medical.app.account.service.impl.LoginServiceImpl;
import com.medical.app.exception.UnauthorizedException;
import com.medical.app.user.entity.User;
import com.medical.app.user.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
@ExtendWith(MockitoExtension.class)
public class LoginServiceTest {

  @InjectMocks
  private LoginServiceImpl loginService;

  @Mock
  private UserServiceImpl userService;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Test
  void login_WhenUserExists_ReturnsLoginSuccessfully() {

    User user = new User();
    user.setEmail("stefan@google.com");
    user.setPassword("encodedPassword"); // Use a simple string to represent the encoded password

    when(userService.getUserByEmail("stefan@google.com")).thenReturn(user);
    when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true); // Mock password match to return true


    LoginUserDTO loginUserDTO = new LoginUserDTO();
    loginUserDTO.setEmail("stefan@google.com");
    loginUserDTO.setPassword("password");
    ResponseEntity<MyAccountRecord> loginResponse = loginService.login(null, loginUserDTO);

    assertEquals(200, loginResponse.getStatusCode());
  }

  @Test
  void login_WhenUserDoesNotExist_ThrowsUnauthorizedException() {

    LoginUserDTO wrongUser = new LoginUserDTO();
    wrongUser.setEmail("stefan@google.com");
    wrongUser.setPassword("password");

    Assertions.assertThrows(UnauthorizedException.class, () -> {
      loginService.login(null, wrongUser);
    }, "Invalid email or password");

  }
}
