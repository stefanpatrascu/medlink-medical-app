package com.medical.app.appointment.repository;

import com.medical.app.appointment.entity.Appointment;
import com.medical.app.appointment.enums.AppointmentStatusEnum;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentsRepository extends JpaRepository<Appointment, Long> {

  @Query("""
      FROM Appointment WHERE ((appointmentStartDate >= :appointmentStartDate 
      AND appointmentEndDate <= :appointmentEndDate) OR
      (appointmentEndDate > :appointmentStartDate AND appointmentStartDate < :appointmentEndDate))
      AND doctor.id = :doctor_id AND appointmentStatus <> 'CANCELED'
      """)
  List<Appointment> findOverlapByStartAndEndDate(
      LocalDateTime appointmentStartDate,
      LocalDateTime appointmentEndDate,
      Long doctor_id);
  Page<Appointment> findAll(Specification<Appointment> specification, Pageable pageable);

  List<Appointment> findAllByDoctorIdAndAppointmentStartDateBetween(Long doctorId, LocalDateTime startDate, LocalDateTime endDate);

  @Query("FROM Appointment WHERE doctor.id = :doctorId")
  List<Appointment> findAppointmentsByDoctorId(Long doctorId);

  @Query("FROM Appointment WHERE patient.id = :patientId")
  List<Appointment> findAppointmentsByPatientId(Long patientId);

  Appointment findAppointmentById(Long id);

  @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentStatus = :status")
  Long countAppointmentByStatus(AppointmentStatusEnum status);

  @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentStatus = :status AND a.doctor.id = :doctorId")
  Long countAppointmentsByStatusAndDoctorId(AppointmentStatusEnum status, Long doctorId);

  @Query("SELECT COUNT(a) FROM Appointment a")
  Long countAllAppointments();

  @Query("FROM Appointment a WHERE a.patient.id = :patientId AND a.id = :id")
  Appointment findAppointmentByIdAndPatientId(Long id, Long patientId);
}

