package com.medical.app.user.service;

import com.medical.app.pagination.dto.GenericRequestDTO;
import com.medical.app.user.dto.CreateUserDTO;
import com.medical.app.user.dto.UpdateUserDTO;
import com.medical.app.user.dto.record.DoctorRecord;
import com.medical.app.user.dto.record.UserRecord;
import com.medical.app.user.entity.User;
import com.medical.app.util.ApiResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
  List<User> getAllUsers();

  User getUserById(Long id);

  User getUserByEmail(String email);

  List<User> getUserByEmailOrCnp(String email, String cnp);

  ResponseEntity<ApiResponse> createUser(CreateUserDTO createUserDTO, UserDetails currentUser);

  ResponseEntity<ApiResponse> updateUser(Long id, UpdateUserDTO updateUserDTO, UserDetails currentUser);

  ResponseEntity<ApiResponse> deleteUser(Long id, UserDetails currentUser);

  List<DoctorRecord> getAllDoctors();

  Page<UserRecord> getAllUsersPageable(GenericRequestDTO requestFilterDTO);
}
