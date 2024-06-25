package com.medical.app.account;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.medical.app.account.dto.record.MyAccountRecord;
import com.medical.app.account.service.impl.AccountServiceImpl;
import com.medical.app.exception.NotFoundException;
import com.medical.app.user.entity.User;
import com.medical.app.user.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

  @Mock
  private UserServiceImpl userService;

  @InjectMocks
  private AccountServiceImpl accountServiceImpl;

  private UserDetails currentUser;
  private User expectedUser;

  @BeforeEach
  void setUp() {
    currentUser = mock(UserDetails.class);
    expectedUser = new User();
    expectedUser.setEmail("user@example.com");
  }


  @Test
  void getAccountDetails_WhenUserExists_ReturnsUser() {
    when(currentUser.getUsername()).thenReturn("user@example.com");
    when(userService.getUserByEmail("user@example.com")).thenReturn(expectedUser);

    ResponseEntity<MyAccountRecord> response = accountServiceImpl.getAccountDetails(currentUser);

    assertEquals(expectedUser, response.getBody());
    assertEquals(200, response.getStatusCodeValue());
  }

  @Test
  void getAccountDetails_WhenUserDoesNotExist_ThrowsNotFoundException() {
    when(currentUser.getUsername()).thenReturn("user@example.com");
    when(userService.getUserByEmail("user@example.com")).thenReturn(null);

    assertThrows(NotFoundException.class, () -> accountServiceImpl.getAccountDetails(currentUser));
  }
}
