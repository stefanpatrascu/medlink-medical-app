package com.medical.app.appointment.entity;

import com.medical.app.appointment.enums.AppointmentStatusEnum;
import com.medical.app.clinics.entity.Clinic;
import com.medical.app.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "medical_appointments")
public class Appointment {

  @Id()
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "appointment_start_date")
  private LocalDateTime appointmentStartDate;

  @Column(name = "appointment_end_date")
  private LocalDateTime appointmentEndDate;

  @Column(name = "appointment_status")
  @Enumerated(EnumType.STRING)
  private AppointmentStatusEnum appointmentStatus;

  @OneToOne
  @JoinColumn(name = "patient_user_id", referencedColumnName = "id")
  private User patient;

  @OneToOne
  @JoinColumn(name = "clinic_id", referencedColumnName = "id")
  private Clinic clinic;

  @OneToOne
  @JoinColumn(name = "doctor_user_id", referencedColumnName = "id")
  private User doctor;

  @OneToOne
  @JoinColumn(name = "last_updated_by", referencedColumnName = "id")
  private User lastUpdatedBy;

  @Column(name = "last_updated_date")
  private LocalDateTime lastUpdatedDate;

  @OneToOne
  @JoinColumn(name = "created_by", referencedColumnName = "id")
  private User createdBy;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "observations")
  private String observations;

  @Column(name = "recommendations")
  private String recommendations;

}
