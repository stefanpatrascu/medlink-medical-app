package com.medical.app.account.service.impl;

import com.medical.app.account.dto.RegisterUserDTO;
import com.medical.app.account.service.RegisterService;
import com.medical.app.exception.BadRequestException;
import com.medical.app.exception.ConflictException;
import com.medical.app.logs.enums.LogActionEnum;
import com.medical.app.logs.service.impl.LogServiceImpl;
import com.medical.app.user.entity.Role;
import com.medical.app.user.entity.User;
import com.medical.app.user.enums.RoleEnum;
import com.medical.app.user.repository.UserRepository;
import com.medical.app.user.service.impl.UserServiceImpl;
import com.medical.app.util.ApiResponse;
import com.medical.app.util.DateValidator;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RegisterServiceImpl implements RegisterService {

  private final UserServiceImpl userService;
  private final UserRepository userRepository;
  private PasswordEncoder passwordEncoder;
  private LogServiceImpl logService;

  public ResponseEntity<ApiResponse> register(RegisterUserDTO registerUserDTO) {

    final List<User> userFound = userService.getUserByEmailOrCnp(registerUserDTO.getEmail(), registerUserDTO.getCnp());

    if (userFound.size() > 0) {
      throw new ConflictException("User with the same email or CNP already exists");
    }

    if (!DateValidator.localDateIsValid(registerUserDTO.getDateOfBirth())) {
      throw new BadRequestException("Invalid date format");
    }

    if (LocalDate.parse(registerUserDTO.getDateOfBirth()).isAfter(LocalDate.now())) {
      throw new BadRequestException("Date of birth cannot be in the future");
    }

    final User newUser = new User();
    newUser.setEmail(registerUserDTO.getEmail().toLowerCase());
    newUser.setPassword(passwordEncoder.encode(registerUserDTO.getPassword()));
    newUser.setEnabled(true);
    newUser.setFirstName(registerUserDTO.getFirstName());
    newUser.setLastName(registerUserDTO.getLastName());
    newUser.setCnp(registerUserDTO.getCnp());
    newUser.setDateOfBirth(LocalDate.parse(registerUserDTO.getDateOfBirth()));
    newUser.setPhoneNumber(registerUserDTO.getPhoneNumber());
    newUser.setCity(registerUserDTO.getCity());
    newUser.setCountry(registerUserDTO.getCountry());
    newUser.setAddress(registerUserDTO.getAddress());
    newUser.setCounty(registerUserDTO.getCounty());
    newUser.setPostalCode(registerUserDTO.getPostalCode());

    final Role role = new Role();
    role.setRole(RoleEnum.PATIENT);
    role.setUser(newUser);

    newUser.setRoles(Set.of(role));

    userRepository.save(newUser);

    logService.addLog(LogActionEnum.USER_REGISTERED, "User registered with email: " + newUser.getEmail());

    return ApiResponse.created("User registered successfully");
  }
}
