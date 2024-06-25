package com.medical.app.appointment.service;

import com.medical.app.clinics.entity.Clinic;
import com.medical.app.user.entity.User;
import java.time.LocalDateTime;

public interface AppointmentValidationService {

  void validatePatientDoctorAndClinic(User patient, User doctor, Clinic clinic);

  void checkIfDoctorIsAvailable(User doctor, LocalDateTime startDate, LocalDateTime endDate);

  void validateAppointmentDates(LocalDateTime startDate, LocalDateTime endDate, boolean isUpdate);

  void checkForAppointmentOverlaps(User doctor, LocalDateTime startDate, LocalDateTime endDate, Long appointmentId);
}
