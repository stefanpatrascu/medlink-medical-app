package com.medical.app.user.service.impl;

import com.medical.app.appointment.entity.Appointment;
import com.medical.app.appointment.repository.AppointmentsRepository;
import com.medical.app.clinics.entity.Clinic;
import com.medical.app.clinics.repository.ClinicRepository;
import com.medical.app.employee.dto.WorkProgramWeekDTO;
import com.medical.app.employee.entity.Employee;
import com.medical.app.employee.entity.WorkProgram;
import com.medical.app.employee.repository.EmployeeRepository;
import com.medical.app.exception.BadRequestException;
import com.medical.app.exception.ConflictException;
import com.medical.app.exception.NotFoundException;
import com.medical.app.logs.enums.LogActionEnum;
import com.medical.app.logs.service.impl.LogServiceImpl;
import com.medical.app.pagination.dto.GenericRequestDTO;
import com.medical.app.pagination.service.PaginationService;
import com.medical.app.user.dto.CreateUserDTO;
import com.medical.app.user.dto.EmployeeDTO;
import com.medical.app.user.dto.UpdateUserDTO;
import com.medical.app.user.dto.record.DoctorRecord;
import com.medical.app.user.dto.record.PatientRecord;
import com.medical.app.user.dto.record.UserRecord;
import com.medical.app.user.entity.Role;
import com.medical.app.user.entity.User;
import com.medical.app.user.enums.EmployeeErrorsEnum;
import com.medical.app.user.enums.RoleEnum;
import com.medical.app.user.repository.UserRepository;
import com.medical.app.user.service.UserService;
import com.medical.app.util.ApiResponse;
import com.medical.app.util.DateValidator;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
  private UserRepository userRepository;
  private ClinicRepository clinicRepository;
  private PasswordEncoder passwordEncoder;
  private PaginationService paginationService;
  private EmployeeRepository employeeRepository;
  private AppointmentsRepository appointmentsRepository;
  private LogServiceImpl logService;

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public Page<UserRecord> getAllUsersPageable(GenericRequestDTO requestFilterDTO) {

    Page<User> usersPage = userRepository.findAll(
        paginationService.createSpecification(requestFilterDTO.getFilters()),
        paginationService.createPageable(requestFilterDTO));

    return usersPage.map(user ->
        new UserRecord(
            user.getId(),
            user.getFullName(),
            user.getCnp(),
            user.getEmail(),
            user.getPhoneNumber(),
            Optional.ofNullable(user.getEmployee()).isEmpty() ? Optional.empty() : Optional.ofNullable(
                user.getEmployee().getHireDate()),
            user.getLastLogin(),
            user.getRolesList(),
            Optional.ofNullable(user.getEmployee()).isEmpty() ? Optional.empty() : Optional.ofNullable(
                user.getEmployee().getSpecialization()),
            Optional.ofNullable(user.getEmployee()).isEmpty() ? Optional.empty() : Optional.ofNullable(
                user.getEmployee().getEmployeeType()),
            user.isEnabled(),
            user.getUpdatedAt()
        )
    );
  }

  public List<DoctorRecord> getAllDoctors() {
    return userRepository.findUsersByRole(RoleEnum.DOCTOR).stream()
        .filter(doctor -> doctor.getEmployee() != null)
        .map(doctor ->
            new DoctorRecord(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getEmployee().getSpecialization(),
                doctor.getEmployee().getClinic(),
                doctor.getEmployee().getWorkPrograms()
            )
        ).toList();
  }

  public List<PatientRecord> getAllPatients() {
    return userRepository.findUsersByRole(RoleEnum.PATIENT).stream()
        .map(patient ->
            new PatientRecord(
                patient.getId(),
                patient.getFullName(),
                patient.getCnp()
            )
        ).toList();
  }

  public User getUserById(Long id) {
    return userRepository.findById(id).orElseThrow(() ->
        new NotFoundException("User not found with id " + id));
  }

  public DoctorRecord getDoctorById(Long id) {
    User doctor = userRepository.findUserByIdAndRole(id, RoleEnum.DOCTOR);
    if (doctor == null) {
      throw new NotFoundException("Doctor not found with id " + id);
    }
    return new DoctorRecord(
        doctor.getId(),
        doctor.getFullName(),
        doctor.getEmployee().getSpecialization(),
        doctor.getEmployee().getClinic(),
        doctor.getEmployee().getWorkPrograms()
    );
  }

  public User getUserByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  public List<User> getUserByEmailOrCnp(String email, String cnp) {
    return userRepository.findByEmailOrCnp(email, cnp);
  }

  public User getUserByIdAndRole(Long id, RoleEnum role) {
    return userRepository.findUserByIdAndRole(id, role);
  }

  @Transactional
  public ResponseEntity<ApiResponse> deleteUser(Long id, UserDetails currentUser) {

    User userFound = getUserById(id);

    if (currentUser.getUsername().equals(getUserById(id).getEmail())) {
      throw new ConflictException(EmployeeErrorsEnum.CANNOT_DELETE_YOURSELF.toString());
    }

    List<Appointment> appointmentsByDoctor = appointmentsRepository.findAppointmentsByDoctorId(id);
    List<Appointment> appointmentsByPatient = appointmentsRepository.findAppointmentsByPatientId(id);

    appointmentsRepository.deleteAll(appointmentsByDoctor);
    appointmentsRepository.deleteAll(appointmentsByPatient);

    if (userFound.getEmployee() != null) {
      employeeRepository.delete(userFound.getEmployee());
    }

    userRepository.delete(userFound);

    logService.addLog(LogActionEnum.DELETE_USER, "User with email " + userFound.getEmail() +
        " was deleted by " + currentUser.getUsername());

    return ApiResponse.ok("User deleted successfully");
  }

  @Transactional
  public ResponseEntity<ApiResponse> createUser(CreateUserDTO createUserDTO, UserDetails currentUser) {
    if (getUserByEmailOrCnp(createUserDTO.getEmail(), createUserDTO.getCnp()).size() > 0) {
      throw new ConflictException(EmployeeErrorsEnum.USER_ALREADY_EXISTS_WITH_SAME_EMAIL_OR_CNP.toString());
    }

    if (createUserDTO.getRoles().stream().filter(role -> role.equals(RoleEnum.PATIENT)).count() == 0) {
      createUserDTO.getRoles().add(RoleEnum.PATIENT);
    }

    final User newEmployee = createUserObject(createUserDTO);
    newEmployee.setRoles(createRolesObject(createUserDTO.getRoles(), newEmployee));

    if (createUserDTO.getEmployee() != null) {
      newEmployee.setEmployee(createEmployeeObject(createUserDTO.getEmployee(), newEmployee));
    }

    logService.addLog(LogActionEnum.USER_CREATED,
        "User with email" + newEmployee.getEmail() + " was created by " + currentUser.getUsername());


    userRepository.saveAndFlush(newEmployee);

    return ApiResponse.created("Employee created successfully");
  }

  @Transactional
  public ResponseEntity<ApiResponse> updateUser(Long id, UpdateUserDTO updateUserDTO, UserDetails currentUser) {
    User userFound = getUserById(id);

    if (updateUserDTO.getPrefix() == null) {
      userFound.setPrefix(null);
    } else {
      userFound.setPrefix(updateUserDTO.getPrefix());
    }

    if (updateUserDTO.getRoles().stream().filter(role -> role.equals(RoleEnum.PATIENT)).count() == 0) {
      updateUserDTO.getRoles().add(RoleEnum.PATIENT);
    }

    userRepository.findByEmailOrCnp(updateUserDTO.getEmail(), updateUserDTO.getCnp())
        .stream()
        .filter(user -> !user.getId().equals(id))
        .findFirst()
        .ifPresent(user -> {
          throw new ConflictException(EmployeeErrorsEnum.USER_ALREADY_EXISTS_WITH_SAME_EMAIL_OR_CNP.toString());
        });

    userFound.setEmail(updateUserDTO.getEmail().toLowerCase());
    userFound.setEnabled(updateUserDTO.getEnabled());
    userFound.setFirstName(updateUserDTO.getFirstName());
    userFound.setLastName(updateUserDTO.getLastName());
    userFound.setCnp(updateUserDTO.getCnp());
    userFound.setDateOfBirth(LocalDate.parse(updateUserDTO.getDateOfBirth()));
    userFound.setPhoneNumber(updateUserDTO.getPhoneNumber());
    userFound.setUpdatedAt(LocalDateTime.now());

    userFound.getRoles().clear(); // clear the old roles
    createRolesObject(
        updateUserDTO.getRoles(),
        userFound).forEach(role -> userFound.getRoles().add(role));

    if (updateUserDTO.getEmployee() != null) {

      if (userFound.getEmployee() == null) {
        userFound.setEmployee(createEmployeeObject(updateUserDTO.getEmployee(), userFound));
      } else {
        userFound.getEmployee().setSpecialization(updateUserDTO.getEmployee().getSpecialization());
        userFound.getEmployee().setEmployeeType(updateUserDTO.getEmployee().getEmployeeType());
        userFound.getEmployee().setHireDate(LocalDate.parse(updateUserDTO.getEmployee().getHireDate()));

        if (updateUserDTO.getEmployee().getWorkProgramWeek() != null) {
          userFound.getEmployee().getWorkPrograms().clear(); // clear the old work programs
          createWorkProgramList(updateUserDTO.getEmployee().getWorkProgramWeek(), userFound.getEmployee())
              .forEach(workProgram -> userFound.getEmployee().getWorkPrograms().add(workProgram));
        }
      }
    }

    if (!updateUserDTO.getIsEmployee() && userFound.getEmployee() != null) {
      userFound.setPrefix(null);
      userFound.getEmployee().getWorkPrograms().clear();
      employeeRepository.delete(userFound.getEmployee());
      userFound.setEmployee(null);
    }

    logService.addLog(LogActionEnum.USER_UPDATED,
        "User with email" + userFound.getEmail() + " was updated by " + currentUser.getUsername());

    return ApiResponse.ok("User updated successfully");
  }

  private User createUserObject(CreateUserDTO createEmployeeDTO) {
    User newUser = new User();
    newUser.setEmail(createEmployeeDTO.getEmail().toLowerCase());
    if (createEmployeeDTO.getPrefix() != null) {
      newUser.setPrefix(createEmployeeDTO.getPrefix());
    }
    newUser.setPassword(passwordEncoder.encode(createEmployeeDTO.getPassword()));
    newUser.setEnabled(true);
    newUser.setFirstName(createEmployeeDTO.getFirstName());
    newUser.setLastName(createEmployeeDTO.getLastName());
    newUser.setCnp(createEmployeeDTO.getCnp());
    newUser.setDateOfBirth(LocalDate.parse(createEmployeeDTO.getDateOfBirth()));
    newUser.setPhoneNumber(createEmployeeDTO.getPhoneNumber());
    return newUser;
  }

  private Employee createEmployeeObject(EmployeeDTO createEmployeeDTO, User newUser) {
    Employee newEmployee = new Employee();

    Clinic clinicFound = clinicRepository.findById(createEmployeeDTO.getClinicId())
        .orElseThrow(() -> new NotFoundException("Clinic not found"));

    newEmployee.setClinic(clinicFound);
    newEmployee.setUser(newUser);
    newEmployee.setSpecialization(createEmployeeDTO.getSpecialization());
    newEmployee.setEmployeeType(createEmployeeDTO.getEmployeeType());
    newEmployee.setHireDate(LocalDate.parse(createEmployeeDTO.getHireDate()));
    newEmployee.setWorkPrograms(createWorkProgramList(createEmployeeDTO.getWorkProgramWeek(), newEmployee));
    return newEmployee;
  }

  private Set<Role> createRolesObject(List<RoleEnum> roles, User newUser) {
    return roles.stream().map(roleName -> {
      Role role = new Role();
      role.setRole(roleName);
      role.setUser(newUser);
      return role;
    }).collect(Collectors.toSet());
  }

  private List<WorkProgram> createWorkProgramList(List<WorkProgramWeekDTO> workProgramWeekDTO, Employee newEmployee) {
    return workProgramWeekDTO
        .stream().map(workProgramWeek -> {
          if (!DateValidator.isTimeValid(workProgramWeek.getStartTime()) ||
              !DateValidator.isTimeValid(workProgramWeek.getEndTime())) {
            throw new BadRequestException(EmployeeErrorsEnum.INVALID_START_TIME_OR_END_TIME.toString());
          }
          WorkProgram workProgram = new WorkProgram();
          workProgram.setDay(workProgramWeek.getDay());
          workProgram.setEmployee(newEmployee);
          workProgram.setStartTime(LocalTime.parse(
              workProgramWeek.getStartTime()));
          workProgram.setEndTime(LocalTime.parse(workProgramWeek.getEndTime()));
          return workProgram;
        }).collect(Collectors.toList());
  }
}
