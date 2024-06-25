package com.medical.app.appointment.controller;

import com.medical.app.appointment.dto.CreateAppointmentDTO;
import com.medical.app.appointment.dto.DoctorAvailableIntervals;
import com.medical.app.appointment.dto.DoctorDayScheduleResponseDTO;
import com.medical.app.appointment.dto.RescheduleAppointmentDTO;
import com.medical.app.appointment.dto.UpdateAppointmentDTO;
import com.medical.app.appointment.dto.UpdateAppointmentStatusDTO;
import com.medical.app.appointment.dto.record.ViewAppointmentAsDoctorRecord;
import com.medical.app.appointment.dto.record.MyAppointmentsRecord;
import com.medical.app.appointment.entity.Appointment;
import com.medical.app.appointment.enums.AppointmentStatusEnum;
import com.medical.app.appointment.service.impl.AppointmentsServiceImpl;
import com.medical.app.employee.entity.WorkProgram;
import com.medical.app.pagination.dto.GenericRequestDTO;
import com.medical.app.user.constant.RoleConstants;
import com.medical.app.util.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointments")
@AllArgsConstructor
public class AppointmentsController {

  private final AppointmentsServiceImpl appointmentService;

  @PostMapping("/all")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.DOCTOR + "', '" + RoleConstants.ADMIN + "', '" + RoleConstants.FRONT_DESK +
          "')")
  public ResponseEntity<Page<Appointment>> getAllAppointments(@Valid @RequestBody GenericRequestDTO requestFilterDTO) {
    return ResponseEntity.ok(appointmentService.getAllAppointments(requestFilterDTO));
  }

  @GetMapping("/all-doctor-appointments")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.DOCTOR + "', '" + RoleConstants.ADMIN + "', '" + RoleConstants.FRONT_DESK +
          "')")
  public ResponseEntity<List<ViewAppointmentAsDoctorRecord>> getAllDoctorAppointments(
      @Valid @RequestParam("doctorId") Long doctorId,
      @Valid @RequestParam("startDate") String startDate,
      @Valid @RequestParam("endDate") String endDate) {
    return ResponseEntity.ok(appointmentService.getAllByDoctorAndInterval(doctorId, startDate, endDate));
  }

  @GetMapping("/count-by-doctor")
  @PreAuthorize("hasAnyAuthority('" + RoleConstants.DOCTOR + "')")
  public ResponseEntity<HashMap<AppointmentStatusEnum, Long>> getAppointmentsCount(@AuthenticationPrincipal UserDetails currentUser) {
    return ResponseEntity.ok(appointmentService.countAppointmentsByDoctor(currentUser));
  }

  @GetMapping("/count-all")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.DOCTOR + "', '" + RoleConstants.ADMIN + "', '" + RoleConstants.FRONT_DESK +
          "')")
  public ResponseEntity<HashMap<AppointmentStatusEnum, Long>> getAppointmentsCount() {
    return ResponseEntity.ok(appointmentService.countAllAppointments());
  }

  @GetMapping("/appointment/{id}")
  public ResponseEntity<ViewAppointmentAsDoctorRecord> getAppointmentById(@PathVariable Long id) {
    return ResponseEntity.ok(appointmentService.getAppointmentById(id));
  }

  @PostMapping("/export")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.DOCTOR + "', '" + RoleConstants.ADMIN + "', '" + RoleConstants.FRONT_DESK +
          "')")
  public void exportDataToExcelTemplateFile(
      HttpServletResponse response,
      @AuthenticationPrincipal UserDetails currentUser,
      @Valid @RequestBody GenericRequestDTO requestFilterDTO) {
    appointmentService.exportAppointments(response, currentUser, requestFilterDTO);
  }

  @PostMapping("/all-doctor-appointments")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.DOCTOR + "', '" + RoleConstants.ADMIN + "', '" + RoleConstants.FRONT_DESK +
          "')")
  public ResponseEntity<Page<ViewAppointmentAsDoctorRecord>> getDoctorAppointments(
      @AuthenticationPrincipal UserDetails currentUser,
      @Valid @RequestBody GenericRequestDTO requestFilterDTO) {
    return ResponseEntity.ok(appointmentService.getDoctorAppointmentsPageable(currentUser, requestFilterDTO));
  }

  @PostMapping("/my-appointments")
  public ResponseEntity<Page<MyAppointmentsRecord>> getMyAppointments(
      @AuthenticationPrincipal UserDetails currentUser,
      @Valid @RequestBody GenericRequestDTO requestFilterDTO) {
    return ResponseEntity.ok(appointmentService.getMyAppointments(currentUser, requestFilterDTO));
  }

  @PostMapping("/create")
  @PreAuthorize("hasAnyAuthority('" + RoleConstants.PATIENT + "')")
  public ResponseEntity<ApiResponse> createAppointment(
      @Valid @RequestBody CreateAppointmentDTO appointment,
      @AuthenticationPrincipal UserDetails currentUser) {
    return appointmentService.createAppointment(appointment, currentUser);
  }

  @PostMapping("/create-by-doctor")
  @PreAuthorize("hasAnyAuthority('" + RoleConstants.DOCTOR + "', '" + RoleConstants.FRONT_DESK + "')")
  public ResponseEntity<ApiResponse> createAppointmentByDoctor(
      @Valid @RequestBody CreateAppointmentDTO appointment) {
    return appointmentService.createAppointmentByDoctor(appointment);
  }

  @PutMapping("/change-status/{id}")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.DOCTOR + "', '" + RoleConstants.FRONT_DESK + "', '" + RoleConstants.ADMIN +
          "')")
  public ResponseEntity<ApiResponse> changeAppointmentStatus(
      @AuthenticationPrincipal UserDetails currentUser,
      @PathVariable Long id,
      @Valid @RequestBody UpdateAppointmentStatusDTO updateAppointmentStatusDTO) {
    return appointmentService.changeAppointmentStatus(currentUser, id, updateAppointmentStatusDTO.getStatus());
  }

  @PatchMapping("/update-appointment/{id}")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.DOCTOR + "', '" + RoleConstants.FRONT_DESK + "', '" + RoleConstants.ADMIN +
          "')")
  public ResponseEntity<ApiResponse> updateAppointment(
      @PathVariable Long id,
      @Valid @RequestBody UpdateAppointmentDTO appointment,
      @AuthenticationPrincipal UserDetails currentUser) {
    return appointmentService.updateAppointment(id, appointment, currentUser);
  }

  @PutMapping("/cancel-appointment/{id}")
  @PreAuthorize("hasAnyAuthority('" + RoleConstants.PATIENT + "')")
  public ResponseEntity<ApiResponse> cancelAppointment(
      @PathVariable Long id) {
    return appointmentService.cancelAppointment(id);
  }

  @PutMapping("/reschedule/{id}")
  public ResponseEntity<ApiResponse> rescheduleAppointment(
      @AuthenticationPrincipal UserDetails currentUser,
      @PathVariable Long id,
      @Valid @RequestBody RescheduleAppointmentDTO rescheduleAppointmentDTO) {
    return appointmentService.rescheduleAppointment(currentUser, id, rescheduleAppointmentDTO);
  }

  @GetMapping("/get-doctor-programs")
  public ResponseEntity<List<WorkProgram>> getDoctorPrograms(
      @Valid @RequestParam Long doctorId) {
    return ResponseEntity.ok(appointmentService.getDoctorPrograms(doctorId));
  }

  @GetMapping("/get-doctor-spots")
  public ResponseEntity<List<DoctorDayScheduleResponseDTO>> getAvailableSpots(
      @Valid @RequestParam Long doctorId,
      @Valid @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
      @Valid @RequestParam int duration) {
    return ResponseEntity.ok(appointmentService.getAvailableSpotsForDoctor(doctorId, date, duration));
  }
}
