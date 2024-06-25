package com.medical.app.appointment.service.impl;

import com.medical.app.appointment.entity.Appointment;
import com.medical.app.appointment.enums.AppointmentMessagesEnum;
import com.medical.app.appointment.repository.AppointmentsRepository;
import com.medical.app.appointment.service.AppointmentValidationService;
import com.medical.app.clinics.entity.Clinic;
import com.medical.app.employee.entity.WorkProgram;
import com.medical.app.exception.BadRequestException;
import com.medical.app.exception.ConflictException;
import com.medical.app.exception.NotFoundException;
import com.medical.app.user.entity.User;
import com.medical.app.util.DateValidator;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AppointmentValidationServiceImpl implements AppointmentValidationService {

  private final AppointmentsRepository appointmentsRepository;

  public void validatePatientDoctorAndClinic(User patient, User doctor, Clinic clinic) {
    if (patient == null) {
      throw new NotFoundException(AppointmentMessagesEnum.PATIENT_NOT_FOUND.toString());
    }

    if (doctor == null || doctor.getEmployee() == null) {
      throw new NotFoundException(AppointmentMessagesEnum.DOCTOR_NOT_FOUND.toString());
    }

    if (clinic == null) {
      throw new NotFoundException(AppointmentMessagesEnum.CLINIC_NOT_FOUND.toString());
    }

    if (patient.getId().equals(doctor.getId())) {
      throw new BadRequestException(AppointmentMessagesEnum.YOU_CANNOT_CREATE_AN_APPOINTMENT_WITH_YOURSELF.toString());
    }
  }

  public void validateAppointmentDates(LocalDateTime startDate, LocalDateTime endDate, boolean ignorePastDates) {
    if (!ignorePastDates && (startDate.isBefore(LocalDateTime.now()) || endDate.isBefore(LocalDateTime.now()))) {
      throw new BadRequestException(AppointmentMessagesEnum.APPOINTMENT_IN_THE_PAST.toString());
    }

    if (startDate.isAfter(endDate) || startDate.equals(endDate)) {
      throw new BadRequestException(AppointmentMessagesEnum.APPOINTMENT_START_DATE_CANNOT_BE_AFTER_OR_EQUAL_WITH_END_DATE.toString());
    }

    if (!DateValidator.isMinuteOnQuarter(startDate) || !DateValidator.isMinuteOnQuarter(endDate)) {
      throw new BadRequestException(AppointmentMessagesEnum.APPOINTMENT_MUST_START_AND_END_ON_A_QUARTER.toString());
    }
  }

  public void checkIfDoctorIsAvailable(
      User doctorFound,
      LocalDateTime startDate,
      LocalDateTime endDate) {

    List<WorkProgram> workPrograms = doctorFound.getEmployee().getWorkPrograms()
        .stream()
        .filter(workProgram -> workProgram.getDay() == startDate.getDayOfWeek())
        .toList();

    if (workPrograms.isEmpty()) {
      log.error("Doctor is not working at this time");
      throw new ConflictException(AppointmentMessagesEnum.DOCTOR_NOT_WORKING_AT_THIS_TIME.toString());
    }

    workPrograms
        .forEach(workProgram -> {

          LocalTime requestStartAppointmentTime =
              startDate.toLocalTime();
          LocalTime requestEndAppoinemtnTime =
              endDate.toLocalTime();

          boolean isInInterval = (requestStartAppointmentTime.isAfter(workProgram.getStartTime()) || requestStartAppointmentTime.equals(workProgram.getStartTime()))
              && (requestEndAppoinemtnTime.isBefore(workProgram.getEndTime()) || requestEndAppoinemtnTime.equals(workProgram.getEndTime()));

          if (!isInInterval) {
            throw new ConflictException(AppointmentMessagesEnum.DOCTOR_NOT_AVAILABLE.toString());
          }

        });
  }

  public void checkForAppointmentOverlaps(
      User doctor,
      LocalDateTime startDate,
      LocalDateTime endDate,
      Long appointmentId) {
    List<Appointment> appointmentsOverlaps = appointmentsRepository
        .findOverlapByStartAndEndDate(startDate, endDate, doctor.getId())
        .stream().filter(appointment -> !appointment.getId().equals(appointmentId)).toList();

    if (!appointmentsOverlaps.isEmpty()) {
      List<String> overlaps = appointmentsOverlaps.stream()
          .map(appointment -> appointment.getId().toString())
          .toList();
      log.error("Appointment overlaps with another appointment: " + overlaps);
      throw new ConflictException(AppointmentMessagesEnum.APPOINTMENT_OVERLAPS_WITH_ANOTHER_APPOINTMENT.toString());
    }
  }
}
