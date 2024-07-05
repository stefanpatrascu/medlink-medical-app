package com.medical.app.appointment.service.impl;

import com.medical.app.appointment.dto.CreateAppointmentDTO;
import com.medical.app.appointment.dto.DoctorDayScheduleResponseDTO;
import com.medical.app.appointment.dto.ExportAppointmentsDTO;
import com.medical.app.appointment.dto.RescheduleAppointmentDTO;
import com.medical.app.appointment.dto.UpdateAppointmentDTO;
import com.medical.app.appointment.dto.record.AppointmentClinicRecord;
import com.medical.app.appointment.dto.record.AppointmentDoctorInfoRecord;
import com.medical.app.appointment.dto.record.ViewAppointmentAsDoctorRecord;
import com.medical.app.appointment.dto.record.MyAppointmentsRecord;
import com.medical.app.appointment.dto.record.AppointmentPatientRecord;
import com.medical.app.appointment.entity.Appointment;
import com.medical.app.appointment.enums.AppointmentMessagesEnum;
import com.medical.app.appointment.enums.AppointmentStatusEnum;
import com.medical.app.appointment.repository.AppointmentsRepository;
import com.medical.app.appointment.service.AppointmentService;
import com.medical.app.clinics.entity.Clinic;
import com.medical.app.clinics.service.impl.ClinicServiceImpl;
import com.medical.app.employee.entity.WorkProgram;
import com.medical.app.exception.BadRequestException;
import com.medical.app.exception.ForbiddenException;
import com.medical.app.exception.NotFoundException;
import com.medical.app.logs.enums.LogActionEnum;
import com.medical.app.logs.service.impl.LogServiceImpl;
import com.medical.app.pagination.dto.FilterCriteriaDTO;
import com.medical.app.pagination.dto.GenericRequestDTO;
import com.medical.app.pagination.enums.FieldTypeEnum;
import com.medical.app.pagination.enums.FilterOperationEnum;
import com.medical.app.pagination.enums.LogicalOperatorEnum;
import com.medical.app.pagination.service.impl.PaginationServiceImpl;
import com.medical.app.util.CreateReportUtil;
import com.medical.app.user.entity.User;
import com.medical.app.user.enums.RoleEnum;
import com.medical.app.user.repository.UserRepository;
import com.medical.app.user.service.impl.UserServiceImpl;
import com.medical.app.util.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentsServiceImpl implements AppointmentService {

  private static final Logger log = LoggerFactory.getLogger(AppointmentsServiceImpl.class);
  private final AppointmentsRepository appointmentsRepository;
  private final UserRepository userRepository;
  private final UserServiceImpl userService;
  private final ClinicServiceImpl clinicServiceImpl;
  private final AppointmentValidationServiceImpl appointmentValidationService;
  private final PaginationServiceImpl paginationService;
  private final LogServiceImpl logService;

  public Page<Appointment> getAllAppointments(GenericRequestDTO requestFilterDTO) {
    return appointmentsRepository.findAll(
        paginationService.createSpecification(requestFilterDTO.getFilters()),
        paginationService.createPageable(requestFilterDTO)
    );
  }

  public HashMap<AppointmentStatusEnum, Long> countAllAppointments() {
    HashMap<AppointmentStatusEnum, Long> appointmentsCount = new HashMap<>();

    appointmentsCount.put(
        AppointmentStatusEnum.CONFIRMED,
        appointmentsRepository.countAppointmentByStatus(AppointmentStatusEnum.CONFIRMED));
    appointmentsCount.put(
        AppointmentStatusEnum.REQUESTED,
        appointmentsRepository.countAppointmentByStatus(AppointmentStatusEnum.REQUESTED));
    appointmentsCount.put(
        AppointmentStatusEnum.CANCELED,
        appointmentsRepository.countAppointmentByStatus(AppointmentStatusEnum.CANCELED));
    appointmentsCount.put(
        AppointmentStatusEnum.COMPLETED,
        appointmentsRepository.countAppointmentByStatus(AppointmentStatusEnum.COMPLETED));

    return appointmentsCount;
  }

  public HashMap<AppointmentStatusEnum, Long> countAppointmentsByDoctor(UserDetails userDetails) {

    User user = userService.getUserByEmail(userDetails.getUsername());

    if (user == null) {
      throw new NotFoundException(AppointmentMessagesEnum.USER_NOT_FOUND.toString());
    }

    HashMap<AppointmentStatusEnum, Long> appointmentsCount = new HashMap<>();

    appointmentsCount.put(
        AppointmentStatusEnum.CONFIRMED,
        appointmentsRepository.countAppointmentsByStatusAndDoctorId(AppointmentStatusEnum.CONFIRMED, user.getId()));
    appointmentsCount.put(
        AppointmentStatusEnum.REQUESTED,
        appointmentsRepository.countAppointmentsByStatusAndDoctorId(AppointmentStatusEnum.REQUESTED, user.getId()));
    appointmentsCount.put(
        AppointmentStatusEnum.CANCELED,
        appointmentsRepository.countAppointmentsByStatusAndDoctorId(AppointmentStatusEnum.CANCELED, user.getId()));
    appointmentsCount.put(
        AppointmentStatusEnum.COMPLETED,
        appointmentsRepository.countAppointmentsByStatusAndDoctorId(AppointmentStatusEnum.COMPLETED, user.getId()));

    return appointmentsCount;
  }

  public List<ViewAppointmentAsDoctorRecord> getAllByDoctorAndInterval(
      Long doctorId,
      String startDate,
      String endDate) {

    User doctor = userRepository.findUserByIdAndRole(doctorId, RoleEnum.DOCTOR);

    if (doctor == null) {
      throw new NotFoundException(AppointmentMessagesEnum.DOCTOR_NOT_FOUND.toString());
    }

    return appointmentsRepository.findAllByDoctorIdAndAppointmentStartDateBetween(
            doctorId,
            LocalDateTime.parse(startDate),
            LocalDateTime.parse(endDate))
        .stream()
        .map(appointment ->
            new ViewAppointmentAsDoctorRecord(
                appointment.getId(),
                new AppointmentPatientRecord(
                    appointment.getPatient().getId(),
                    appointment.getPatient().getFullName(),
                    appointment.getPatient().getEmail(),
                    appointment.getPatient().getPhoneNumber(),
                    appointment.getPatient().getDateOfBirth().toString(),
                    appointment.getPatient().getCnp()
                ),
                new AppointmentDoctorInfoRecord(
                    appointment.getDoctor().getId(),
                    appointment.getDoctor().getFullName(),
                    appointment.getDoctor().getPhoneNumber(),
                    appointment.getDoctor().getEmail(),
                    appointment.getDoctor().getEmployee().getSpecialization().toString()
                ),
                new AppointmentClinicRecord(
                    appointment.getClinic().getId(),
                    appointment.getClinic().getClinicName()
                ),
                appointment.getAppointmentStartDate().toString(),
                appointment.getAppointmentEndDate().toString(),
                appointment.getAppointmentStatus(),
                appointment.getLastUpdatedBy().getFullName(),
                appointment.getLastUpdatedDate().toString(),
                appointment.getCreatedAt().toString(),
                null,
                null
            )
        ).toList();
  }

  public Page<ViewAppointmentAsDoctorRecord> getDoctorAppointmentsPageable(
      UserDetails currentUser,
      GenericRequestDTO requestFilterDTO) {
    final User user = userService.getUserByEmail(currentUser.getUsername());

    if (user == null) {
      throw new NotFoundException("User not found");
    }

    Page<Appointment> appointmentsPage = appointmentsRepository.findAll(
        paginationService.createSpecification(requestFilterDTO.getFilters()),
        paginationService.createPageable(requestFilterDTO)
    );

    return appointmentsPage.map(appointment ->
        new ViewAppointmentAsDoctorRecord(
            appointment.getId(),
            new AppointmentPatientRecord(
                appointment.getPatient().getId(),
                appointment.getPatient().getFullName(),
                appointment.getPatient().getEmail(),
                appointment.getPatient().getPhoneNumber(),
                appointment.getPatient().getDateOfBirth().toString(),
                appointment.getPatient().getCnp()
            ),
            new AppointmentDoctorInfoRecord(
                appointment.getDoctor().getId(),
                appointment.getDoctor().getFullName(),
                appointment.getDoctor().getPhoneNumber(),
                appointment.getDoctor().getEmail(),
                appointment.getDoctor().getEmployee().getSpecialization().toString()
            ),
            new AppointmentClinicRecord(
                appointment.getClinic().getId(),
                appointment.getClinic().getClinicName()
            ),
            appointment.getAppointmentStartDate().toString(),
            appointment.getAppointmentEndDate().toString(),
            appointment.getAppointmentStatus(),
            appointment.getLastUpdatedBy().getFullName(),
            appointment.getLastUpdatedDate().toString(),
            appointment.getCreatedAt().toString(),
            null,
            null
        )
    );
  }

  public Page<MyAppointmentsRecord> getMyAppointments(UserDetails currentUser, GenericRequestDTO requestFilterDTO) {
    final User user = userService.getUserByEmail(currentUser.getUsername());

    if (user == null) {
      throw new NotFoundException("User not found");
    }

    List<FilterCriteriaDTO> customFilters = Stream.concat(
        Stream.of(new FilterCriteriaDTO(
            "patient.id",
            user.getId().toString(),
            FilterOperationEnum.EQUALS,
            LogicalOperatorEnum.AND,
            FieldTypeEnum.LONG)
        ),
        requestFilterDTO.getFilters().stream()
    ).toList();

    Page<Appointment> appointmentsPage = appointmentsRepository.findAll(
        paginationService.createSpecification(customFilters),
        paginationService.createPageable(requestFilterDTO)
    );

    return appointmentsPage.map(appointment ->
        new MyAppointmentsRecord(
            appointment.getId(),
            appointment.getAppointmentStartDate().toString(),
            appointment.getAppointmentEndDate().toString(),
            appointment.getAppointmentStatus(),
            appointment.getClinic().getClinicName(),
            appointment.getClinic().getId(),
            appointment.getDoctor().getFullName(),
            appointment.getDoctor().getId(),
            appointment.getCreatedAt().toString()
        )
    );
  }

  public void exportAppointments(
      HttpServletResponse response, UserDetails currentUser,
      GenericRequestDTO requestFilterDTO) {

    requestFilterDTO.setSize(1000);

    List<ExportAppointmentsDTO> appointments = new ArrayList<>();

    getDoctorAppointmentsPageable(currentUser, requestFilterDTO)
        .getContent().forEach(
            appointmentsRecord -> {
              appointments.add(ExportAppointmentsDTO.builder()
                  .id(appointmentsRecord.id())
                  .patientName(appointmentsRecord.patient().fullName())
                  .status(appointmentsRecord.status().toString())
                  .patientPhone(appointmentsRecord.patient().phoneNumber())
                  .doctorName(appointmentsRecord.doctor().fullName())
                  .appointmentDate(LocalDateTime.parse(appointmentsRecord.appointmentStartDate())
                      .format(DateTimeFormatter.ofPattern("dd/MM/yyyy")).toString())
                  .appointmentStartTime(LocalDateTime.parse(appointmentsRecord.appointmentStartDate())
                      .toLocalTime()
                      .toString())
                  .appointmentEndTime(LocalDateTime.parse(appointmentsRecord.appointmentEndDate())
                      .toLocalTime().toString())
                  .build());
            }
        );

    Map<String, Object> data = new HashMap<>();
    data.put("data", appointments);

   CreateReportUtil.createReport(
        response,
        data,
        "export_appointments_template",
        "EXPORTED_APPOINTMENTS_V" + LocalDateTime.now().toLocalTime().toString()
    );
  }

  public ViewAppointmentAsDoctorRecord getAppointmentById(Long id) {
    return appointmentsRepository.findById(id)
        .map(appointment ->
            new ViewAppointmentAsDoctorRecord(
                appointment.getId(),
                new AppointmentPatientRecord(
                    appointment.getPatient().getId(),
                    appointment.getPatient().getFullName(),
                    appointment.getPatient().getEmail(),
                    appointment.getPatient().getPhoneNumber(),
                    appointment.getPatient().getDateOfBirth().toString(),
                    appointment.getPatient().getCnp()
                ),
                new AppointmentDoctorInfoRecord(
                    appointment.getDoctor().getId(),
                    appointment.getDoctor().getFullName(),
                    appointment.getDoctor().getPhoneNumber(),
                    appointment.getDoctor().getEmail(),
                    appointment.getDoctor().getEmployee().getSpecialization().toString()
                ),
                new AppointmentClinicRecord(
                    appointment.getClinic().getId(),
                    appointment.getClinic().getClinicName()
                ),
                appointment.getAppointmentStartDate().toString(),
                appointment.getAppointmentEndDate().toString(),
                appointment.getAppointmentStatus(),
                appointment.getLastUpdatedBy().getFullName(),
                appointment.getLastUpdatedDate().toString(),
                appointment.getCreatedAt().toString(),
                appointment.getRecommendations(),
                appointment.getObservations()
            )
        ).orElseThrow(() -> new NotFoundException(AppointmentMessagesEnum.APPOINTMENT_NOT_FOUND.toString()));
  }

  public ResponseEntity<ApiResponse> updateAppointment(
      Long id, UpdateAppointmentDTO updateAppointmentDTO,
      UserDetails userDetails) {
    final Appointment appointment = appointmentsRepository.findById(id).orElseThrow(() ->
        new NotFoundException(AppointmentMessagesEnum.APPOINTMENT_NOT_FOUND.toString()));

    final User user = userService.getUserByEmail(userDetails.getUsername());

    if (user == null) {
      throw new NotFoundException(AppointmentMessagesEnum.USER_NOT_FOUND.toString());
    }

    if (updateAppointmentDTO.getObservations() != null) {
      appointment.setObservations(updateAppointmentDTO.getObservations());
    }
    if (updateAppointmentDTO.getRecommendations() != null) {
      appointment.setRecommendations(updateAppointmentDTO.getRecommendations());
    }
    if (updateAppointmentDTO.getStatus() != null) {
      appointment.setAppointmentStatus(updateAppointmentDTO.getStatus());
    }

    final User patient = appointment.getPatient();
    final Clinic clinic = appointment.getClinic();
    final User doctor = appointment.getDoctor();

    if (updateAppointmentDTO.getAppointmentStartDate() != null &&
        updateAppointmentDTO.getAppointmentEndDate() != null) {
      final LocalDateTime startDate = LocalDateTime.parse(updateAppointmentDTO.getAppointmentStartDate());
      final LocalDateTime endDate = LocalDateTime.parse(updateAppointmentDTO.getAppointmentEndDate());

      // Validate the appointment
      appointmentValidationService.validatePatientDoctorAndClinic(patient, doctor, clinic);
      appointmentValidationService.checkIfDoctorIsAvailable(doctor, startDate, endDate);
      appointmentValidationService.validateAppointmentDates(startDate, endDate, true);
      appointmentValidationService.checkForAppointmentOverlaps(doctor, startDate, endDate, id);

      appointment.setAppointmentStartDate(startDate);
      appointment.setAppointmentEndDate(endDate);
    }

    appointment.setLastUpdatedBy(user);
    appointment.setLastUpdatedDate(LocalDateTime.now());

    appointmentsRepository.save(appointment);

    logService.addLog(LogActionEnum.UPDATE_APPOINTMENT,
        "Appointment ID: " + appointment.getId() + " updated by " + userDetails.getUsername());

    return ApiResponse.ok(AppointmentMessagesEnum.APPOINTMENT_UPDATED_SUCCESSFULLY.toString());
  }

  public ResponseEntity<ApiResponse> changeAppointmentStatus(
      UserDetails currentUser, Long appointmentId,
      AppointmentStatusEnum appointmentStatusEnum) {

    Appointment appointment = appointmentsRepository.findById(appointmentId).orElseThrow(() ->
        new NotFoundException(AppointmentMessagesEnum.APPOINTMENT_NOT_FOUND.toString()));

    User user = userService.getUserByEmail(currentUser.getUsername());

    if (user == null) {
      throw new NotFoundException(AppointmentMessagesEnum.USER_NOT_FOUND.toString());
    }

    appointment.setLastUpdatedBy(user);
    appointment.setAppointmentStatus(appointmentStatusEnum);
    appointment.setLastUpdatedDate(LocalDateTime.now());

    appointmentsRepository.save(appointment);

    logService.addLog(LogActionEnum.UPDATE_APPOINTMENT,
        "Appointment ID: " + appointment.getId() + " updated by " + currentUser.getUsername());

    return ApiResponse.ok(AppointmentMessagesEnum.APPOINTMENT_STATUS_CHANGED_SUCCESSFULLY.toString());
  }

  public ResponseEntity<ApiResponse> cancelAppointment(Long id) {
    Appointment appointment = appointmentsRepository.findById(id).orElseThrow(() ->
        new NotFoundException(AppointmentMessagesEnum.APPOINTMENT_NOT_FOUND.toString()));

    if (appointment.getAppointmentStatus().equals(AppointmentStatusEnum.CANCELED)) {
      throw new BadRequestException(AppointmentMessagesEnum.APPOINTMENT_ALREADY_CANCELLED.toString());
    }

    if (appointment.getAppointmentStartDate().isBefore(LocalDateTime.now())) {
      throw new BadRequestException(AppointmentMessagesEnum.APPOINTMENT_CANNOT_BE_CANCELLED.toString());
    }

    appointment.setAppointmentStatus(AppointmentStatusEnum.CANCELED);
    appointment.setLastUpdatedDate(LocalDateTime.now());
    appointment.setLastUpdatedBy(appointment.getPatient());

    appointmentsRepository.save(appointment);

    return ApiResponse.ok(AppointmentMessagesEnum.APPOINTMENT_CANCELLED_SUCCESSFULLY.toString());
  }

  public ResponseEntity<ApiResponse> rescheduleAppointment(
      UserDetails currentUser,
      Long appointmentId,
      RescheduleAppointmentDTO rescheduleAppointmentDTO) {

    final Appointment appointment = appointmentsRepository.findAppointmentById(appointmentId);

    final User user = userService.getUserByEmail(currentUser.getUsername());

    if (appointment == null) {
      throw new NotFoundException(AppointmentMessagesEnum.APPOINTMENT_NOT_FOUND.toString());
    }

    final User patient = appointment.getPatient();
    final Clinic clinic = appointment.getClinic();
    final User doctor = appointment.getDoctor();
    final LocalDateTime startDate = LocalDateTime.parse(rescheduleAppointmentDTO.getAppointmentStartDate());
    final LocalDateTime endDate = LocalDateTime.parse(rescheduleAppointmentDTO.getAppointmentEndDate());

    // Validate the appointment
    appointmentValidationService.validatePatientDoctorAndClinic(patient, doctor, clinic);
    appointmentValidationService.checkIfDoctorIsAvailable(doctor, startDate, endDate);
    appointmentValidationService.validateAppointmentDates(startDate, endDate, false);
    appointmentValidationService.checkForAppointmentOverlaps(doctor, startDate, endDate, appointmentId);

    appointment.setAppointmentStartDate(startDate);
    appointment.setAppointmentEndDate(endDate);
    appointment.setLastUpdatedBy(user);
    appointment.setLastUpdatedDate(LocalDateTime.now());

    final Boolean isPatient =
        appointment.getPatient().getEmail().equals(currentUser.getUsername()) &&
            currentUser.getAuthorities().size() == 1;

    if (isPatient) {
      if (!appointment.getPatient().getEmail().equals(currentUser.getUsername())) {
        throw new ForbiddenException(AppointmentMessagesEnum.NOT_ALLOWED_TO_CHANGE_APPOINTMENT_STATUS.toString());
      }
      appointment.setAppointmentStatus(AppointmentStatusEnum.REQUESTED);
    } else {
      appointment.setAppointmentStatus(AppointmentStatusEnum.CONFIRMED);
    }

    appointmentsRepository.save(appointment);

    return ApiResponse.ok(AppointmentMessagesEnum.APPOINTMENT_RESCHEDULED_SUCCESSFULLY.toString());
  }

  public ResponseEntity<ApiResponse> createAppointment(
      CreateAppointmentDTO appointmentDTO,
      UserDetails currentUser) {

    final User patient = userService.getUserByEmail(currentUser.getUsername());
    final Clinic clinic = clinicServiceImpl.getClinicById(appointmentDTO.getClinicId());
    final User doctor = userRepository.findUserByIdAndRole(appointmentDTO.getDoctorId(), RoleEnum.DOCTOR);
    final LocalDateTime startDate = LocalDateTime.parse(appointmentDTO.getAppointmentStartDate());
    final LocalDateTime endDate = LocalDateTime.parse(appointmentDTO.getAppointmentEndDate());

    // Validate the appointment
    appointmentValidationService.validatePatientDoctorAndClinic(patient, doctor, clinic);
    appointmentValidationService.checkIfDoctorIsAvailable(doctor, startDate, endDate);
    appointmentValidationService.validateAppointmentDates(startDate, endDate, false);
    appointmentValidationService.checkForAppointmentOverlaps(doctor, startDate, endDate, null);

    // Create and save the appointment
    Appointment newAppointment = constructNewAppointment(patient, doctor, clinic,
        AppointmentStatusEnum.REQUESTED,
        startDate, endDate);

    appointmentsRepository.save(newAppointment);

    return ApiResponse.ok(AppointmentMessagesEnum.APPOINTMENT_CREATED_SUCCESSFULLY.toString());
  }

  public ResponseEntity<ApiResponse> createAppointmentByDoctor(
      CreateAppointmentDTO appointmentDTO,
      UserDetails currentUser) {

    final User patient = userService.getUserById(appointmentDTO.getPatientId());

    if (patient == null) {
      throw new NotFoundException(AppointmentMessagesEnum.PATIENT_NOT_FOUND.toString());
    }

    final Clinic clinic = clinicServiceImpl.getClinicById(appointmentDTO.getClinicId());
    final User doctor = userRepository.findUserByIdAndRole(appointmentDTO.getDoctorId(), RoleEnum.DOCTOR);
    final LocalDateTime startDate = LocalDateTime.parse(appointmentDTO.getAppointmentStartDate());
    final LocalDateTime endDate = LocalDateTime.parse(appointmentDTO.getAppointmentEndDate());

    // Validate the appointment
    appointmentValidationService.validatePatientDoctorAndClinic(patient, doctor, clinic);
    appointmentValidationService.checkIfDoctorIsAvailable(doctor, startDate, endDate);
    appointmentValidationService.validateAppointmentDates(startDate, endDate, true);
    appointmentValidationService.checkForAppointmentOverlaps(doctor, startDate, endDate, null);

    // Create and save the appointment
    Appointment newAppointment = constructNewAppointment(patient, doctor, clinic, appointmentDTO.getStatus(),
        startDate, endDate);
    appointmentsRepository.save(newAppointment);

    logService.addLog(LogActionEnum.CREATE_APPOINTMENT, "Appointment ID: " + newAppointment.getId() + " created by " + currentUser.getUsername());

    return ApiResponse.ok(AppointmentMessagesEnum.APPOINTMENT_CREATED_SUCCESSFULLY.toString());
  }

  public List<WorkProgram> getDoctorPrograms(Long doctorId) {
    User doctor = userService.getUserByIdAndRole(doctorId, RoleEnum.DOCTOR);
    if (doctor == null) {
      throw new NotFoundException(AppointmentMessagesEnum.DOCTOR_NOT_FOUND.toString());
    }
    return doctor.getEmployee().getWorkPrograms();
  }

  public List<DoctorDayScheduleResponseDTO> getAvailableSpotsForDoctor(
      Long doctorId,
      LocalDate requestDate,
      int incrementMinutes) {
    User doctor = userService.getUserByIdAndRole(doctorId, RoleEnum.DOCTOR);
    if (doctor == null) {
      throw new BadRequestException(AppointmentMessagesEnum.DOCTOR_NOT_FOUND.toString());
    }
    if (requestDate.isBefore(LocalDate.now())) {
      throw new BadRequestException(AppointmentMessagesEnum.DATE_CANNOT_BE_IN_THE_PAST.toString());
    }

    WorkProgram workProgram = doctor.getEmployee().getWorkPrograms().stream()
        .filter(wp -> wp.getDay().toString().equals(requestDate.getDayOfWeek().toString()))
        .findFirst()
        .orElseThrow(() -> new NotFoundException(AppointmentMessagesEnum.DOCTOR_NOT_AVAILABLE.toString()));

    List<DoctorDayScheduleResponseDTO> schedule = new ArrayList<>();
    LocalDateTime startDateTime = LocalDateTime.of(requestDate, workProgram.getStartTime());
    LocalDateTime endDateTime = LocalDateTime.of(requestDate, workProgram.getEndTime());

    LocalDateTime currentDateTime = startDateTime;
    while (currentDateTime.plusMinutes(incrementMinutes).isBefore(endDateTime) ||
        currentDateTime.plusMinutes(incrementMinutes).equals(endDateTime)) {
      boolean isAvailable = checkAvailability(doctorId, currentDateTime, incrementMinutes);

      if (isAvailable) {
        DoctorDayScheduleResponseDTO slot = new DoctorDayScheduleResponseDTO();
        slot.setDate(requestDate.toString());
        slot.setStartTime(currentDateTime.toLocalTime());
        slot.setEndTime(currentDateTime.plusMinutes(incrementMinutes).toLocalTime());
        schedule.add(slot);
      }
      currentDateTime = currentDateTime.plusMinutes(incrementMinutes);
    }
    return schedule;
  }

  private boolean checkAvailability(Long doctorId, LocalDateTime start, int duration) {
    LocalDateTime end = start.plusMinutes(duration);
    List<Appointment> overlaps = appointmentsRepository.findOverlapByStartAndEndDate(start, end, doctorId);
    return overlaps.isEmpty() && !(start.toLocalDate().equals(LocalDate.now()) && start.isBefore(LocalDateTime.now()));
  }

  private Appointment constructNewAppointment(
      User patient, User doctor, Clinic clinic,
      AppointmentStatusEnum status,
      LocalDateTime startDate, LocalDateTime endDate) {

    Appointment appointment = new Appointment();
    appointment.setAppointmentStartDate(startDate);
    appointment.setAppointmentEndDate(endDate);
    appointment.setPatient(patient);
    appointment.setAppointmentStatus(status);
    appointment.setClinic(clinic);
    appointment.setLastUpdatedBy(patient);
    appointment.setCreatedBy(patient); // TODO: check if this is correct
    appointment.setDoctor(doctor);
    appointment.setCreatedAt(LocalDateTime.now());
    appointment.setLastUpdatedDate(LocalDateTime.now());
    return appointment;
  }
}
