package com.medical.app.appointment.service;

import com.medical.app.appointment.dto.CreateAppointmentDTO;
import com.medical.app.appointment.dto.DoctorDayScheduleResponseDTO;
import com.medical.app.appointment.dto.RescheduleAppointmentDTO;
import com.medical.app.appointment.dto.record.ViewAppointmentAsDoctorRecord;
import com.medical.app.appointment.dto.record.MyAppointmentsRecord;
import com.medical.app.appointment.entity.Appointment;
import com.medical.app.appointment.enums.AppointmentStatusEnum;
import com.medical.app.pagination.dto.GenericRequestDTO;
import com.medical.app.util.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

public interface AppointmentService {
  Page<Appointment> getAllAppointments(GenericRequestDTO requestFilterDTO);
  List<ViewAppointmentAsDoctorRecord> getAllByDoctorAndInterval(Long doctorId, String startDate, String endDate);
  Page<ViewAppointmentAsDoctorRecord> getDoctorAppointmentsPageable(UserDetails currentUser, GenericRequestDTO requestFilterDTO);

  Page<MyAppointmentsRecord> getMyAppointments(UserDetails currentUser, GenericRequestDTO requestFilterDTO);

  ViewAppointmentAsDoctorRecord getAppointmentById(Long id);

  ResponseEntity<ApiResponse> createAppointment(
      CreateAppointmentDTO appointmentDTO,
      UserDetails currentUser);

  ResponseEntity<ApiResponse> rescheduleAppointment(
      UserDetails currentUser,
      Long appointmentId,
      RescheduleAppointmentDTO rescheduleAppointmentDTO);

  void exportAppointments(
      HttpServletResponse response, UserDetails currentUser,
      GenericRequestDTO requestFilterDTO);

  ResponseEntity<ApiResponse> cancelAppointment(Long id);

  ResponseEntity<ApiResponse> changeAppointmentStatus(UserDetails currentUser, Long appointmentId, AppointmentStatusEnum appointmentStatusEnum);

  List<DoctorDayScheduleResponseDTO> getAvailableSpotsForDoctor(Long doctorId, LocalDate requestDate, int duration);
}
