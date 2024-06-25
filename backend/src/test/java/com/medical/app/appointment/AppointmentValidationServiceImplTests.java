package com.medical.app.appointment;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.medical.app.appointment.entity.Appointment;
import com.medical.app.appointment.repository.AppointmentsRepository;
import com.medical.app.appointment.service.impl.AppointmentValidationServiceImpl;
import com.medical.app.employee.entity.Employee;
import com.medical.app.employee.entity.WorkProgram;
import com.medical.app.exception.BadRequestException;
import com.medical.app.exception.ConflictException;
import com.medical.app.user.entity.User;
import com.medical.app.util.DateValidator;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class AppointmentValidationServiceImplTests {
  @Mock
  private AppointmentsRepository appointmentsRepository;

  @InjectMocks
  private AppointmentValidationServiceImpl appointmentValidationService;

  @Mock
  private DateValidator dateValidator;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  private User createDoctor() {
    User doctor = new User();
    doctor.setId(1L);
    return doctor;
  }

  private Appointment createAppointment(Long id, LocalDateTime startDate, LocalDateTime endDate) {
    Appointment appointment = new Appointment();
    appointment.setId(id);
    appointment.setAppointmentStartDate(startDate);
    appointment.setAppointmentEndDate(endDate);
    return appointment;
  }

  private User createUserWithWorkPrograms(List<WorkProgram> workPrograms) {
    User user = new User();
    Employee employee = new Employee();
    employee.setWorkPrograms(workPrograms);
    user.setEmployee(employee);
    return user;
  }

  private User getUserWithoutWorkProgram() {
    return createUserWithWorkPrograms(new ArrayList<>());
  }

  private User getUserWithDefaultWorkProgram() {
    List<WorkProgram> workPrograms = new ArrayList<>();
    WorkProgram workProgram = new WorkProgram();
    workProgram.setStartTime(LocalDateTime.of(2024, 1, 1, 8, 0).toLocalTime());
    workProgram.setEndTime(LocalDateTime.of(2024, 1, 1, 16, 0).toLocalTime());
    workProgram.setDay(LocalDateTime.of(2024, 1, 1, 16, 0).getDayOfWeek());
    workPrograms.add(workProgram);
    return createUserWithWorkPrograms(workPrograms);
  }

  @Test
  public void testCheckForAppointmentOverlaps_ShouldThrowConflictException() {
    User doctor = createDoctor();
    LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 9, 0);
    LocalDateTime endDate = LocalDateTime.of(2024, 1, 1, 10, 0);

    Appointment overlappingAppointment = createAppointment(2L, startDate.plusMinutes(15), endDate.plusMinutes(15));

    when(appointmentsRepository.findOverlapByStartAndEndDate(startDate, endDate, doctor.getId()))
        .thenReturn(Arrays.asList(overlappingAppointment));

    assertThrows(ConflictException.class, () -> {
      appointmentValidationService.checkForAppointmentOverlaps(doctor, startDate, endDate, 1L);
    });
  }

  @Test
  public void testCheckForAppointmentOverlaps_ShouldNotThrowConflictException() {
    User doctor = createDoctor();
    LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 9, 0);
    LocalDateTime endDate = LocalDateTime.of(2024, 1, 1, 10, 0);

    when(appointmentsRepository.findOverlapByStartAndEndDate(startDate, endDate, doctor.getId()))
        .thenReturn(Collections.emptyList());

    assertDoesNotThrow(() -> {
      appointmentValidationService.checkForAppointmentOverlaps(doctor, startDate, endDate, 1L);
    });
  }

  @Test
  public void testCheckIfDoctorIsAvailable_ShouldReturnConflictException() {

    assertThrows(ConflictException.class, () -> {
      LocalDateTime startDate = LocalDateTime.now();
      LocalDateTime endDate = LocalDateTime.now().plusHours(1);
      appointmentValidationService.checkIfDoctorIsAvailable(getUserWithoutWorkProgram(), startDate, endDate);
    });

    assertThrows(ConflictException.class, () -> {
      LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 7, 30);
      LocalDateTime endDate = LocalDateTime.of(2024, 1, 1, 8, 0);
      appointmentValidationService.checkIfDoctorIsAvailable(getUserWithDefaultWorkProgram(), startDate, endDate);
    });

    assertThrows(ConflictException.class, () -> {
      LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 16, 0);
      LocalDateTime endDate = LocalDateTime.of(2024, 1, 1, 16, 30);
      appointmentValidationService.checkIfDoctorIsAvailable(getUserWithDefaultWorkProgram(), startDate, endDate);
    });

    assertThrows(ConflictException.class, () -> {
      LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 20, 0);
      LocalDateTime endDate = LocalDateTime.of(2024, 1, 1, 21, 0);
      appointmentValidationService.checkIfDoctorIsAvailable(getUserWithDefaultWorkProgram(), startDate, endDate);
    });
  }

  @Test
  public void testCheckIfDoctorAvailable_ShouldNotReturnConflictException() {

    assertDoesNotThrow(() -> {
      LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 8, 0);
      LocalDateTime endDate = LocalDateTime.of(2024, 1, 1, 8, 30);
      appointmentValidationService.checkIfDoctorIsAvailable(getUserWithDefaultWorkProgram(), startDate, endDate);
    });

    assertDoesNotThrow(() -> {
      LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 15, 30);
      LocalDateTime endDate = LocalDateTime.of(2024, 1, 1, 16, 0);
      appointmentValidationService.checkIfDoctorIsAvailable(getUserWithDefaultWorkProgram(), startDate, endDate);
    });
  }

  @Test
  public void testValidateAppointmentDates_ShouldThrowBadRequestExceptionForPastDates() {
    LocalDateTime pastDate = LocalDateTime.now().minusDays(1);
    LocalDateTime futureDate = LocalDateTime.now().plusDays(1);

    assertThrows(BadRequestException.class, () -> {
      appointmentValidationService.validateAppointmentDates(pastDate, futureDate, false);
    });

    assertThrows(BadRequestException.class, () -> {
      appointmentValidationService.validateAppointmentDates(futureDate, pastDate, false);
    });
  }

  @Test
  public void testValidateAppointmentDates_ShouldThrowBadRequestExceptionForInvalidDateRange() {
    LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 10, 0);
    LocalDateTime endDate = LocalDateTime.of(2024, 1, 1, 9, 0);

    assertThrows(BadRequestException.class, () -> {
      appointmentValidationService.validateAppointmentDates(startDate, endDate, true);
    });

    assertThrows(BadRequestException.class, () -> {
      appointmentValidationService.validateAppointmentDates(startDate, startDate, true);
    });
  }

}

