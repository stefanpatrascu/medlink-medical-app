package com.medical.app.user.controller;

import com.medical.app.pagination.dto.GenericRequestDTO;
import com.medical.app.user.constant.RoleConstants;
import com.medical.app.user.dto.CreateUserDTO;
import com.medical.app.user.dto.UpdateUserDTO;
import com.medical.app.user.dto.record.DoctorRecord;
import com.medical.app.user.dto.record.PatientRecord;
import com.medical.app.user.dto.record.UserRecord;
import com.medical.app.user.entity.User;
import com.medical.app.user.service.impl.UserServiceImpl;
import com.medical.app.util.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UsersController {

  private final UserServiceImpl userService;

  @GetMapping("/all")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.ADMIN + "', '" + RoleConstants.DOCTOR + "' , '" + RoleConstants.FRONT_DESK +
          "')")
  public ResponseEntity<List<User>> getAllAppointments() {
    return ResponseEntity.ok(userService.getAllUsers());
  }

  @PostMapping("/all")
  public ResponseEntity<Page<UserRecord>> getAllAppointments(
      @Valid @RequestBody GenericRequestDTO requestFilterDTO
  ) {
    return ResponseEntity.ok(userService.getAllUsersPageable(requestFilterDTO));
  }

  @GetMapping("/{id}")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.ADMIN + "', '" + RoleConstants.DOCTOR + "' , '" + RoleConstants.FRONT_DESK +
          "')")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
    return ResponseEntity.ok(userService.getUserById(id));
  }

  @GetMapping("/doctor/{id}")
  public ResponseEntity<DoctorRecord> getDoctorById(@PathVariable Long id) {
    return ResponseEntity.ok(userService.getDoctorById(id));
  }

  @GetMapping("/all-doctors")
  public ResponseEntity<List<DoctorRecord>> getAllDoctors() {
    return ResponseEntity.ok(userService.getAllDoctors());
  }

  @GetMapping("/all-patients")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.ADMIN + "', '" + RoleConstants.DOCTOR + "' , '" + RoleConstants.FRONT_DESK +
          "')")
  public ResponseEntity<List<PatientRecord>> getAllPatients() {
    return ResponseEntity.ok(userService.getAllPatients());
  }

  @PostMapping("/create")
  @PreAuthorize("hasAnyAuthority('" + RoleConstants.ADMIN + "')")
  public ResponseEntity<ApiResponse> createEmployee(@Valid @RequestBody CreateUserDTO createEmployeeDTO) {
    return userService.createUser(createEmployeeDTO);
  }

  @DeleteMapping("/delete/{id}")
  @PreAuthorize("hasAnyAuthority('" + RoleConstants.ADMIN + "')")
  public ResponseEntity<ApiResponse> deleteUser(
      @PathVariable Long id,
      @AuthenticationPrincipal UserDetails currentUser) {
    return userService.deleteUser(id, currentUser);
  }

  @PutMapping("/update/{id}")
  @PreAuthorize("hasAnyAuthority('" + RoleConstants.ADMIN + "')")
  public ResponseEntity<ApiResponse> updateEmployee(
      @PathVariable Long id,
      @Valid @RequestBody UpdateUserDTO createEmployeeDTO) {
    return userService.updateUser(id, createEmployeeDTO);
  }
}
