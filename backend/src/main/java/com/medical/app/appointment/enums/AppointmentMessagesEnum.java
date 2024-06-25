package com.medical.app.appointment.enums;

public enum AppointmentMessagesEnum {
  PATIENT_NOT_FOUND("Patient not found"),
  USER_NOT_FOUND("User not found"),
  DOCTOR_NOT_FOUND("Doctor not found"),
  CLINIC_NOT_FOUND("Clinic not found"),
  YOU_CANNOT_CREATE_AN_APPOINTMENT_WITH_YOURSELF("You cannot create an appointment with yourself"),

  APPOINTMENT_START_DATE_CANNOT_BE_AFTER_OR_EQUAL_WITH_END_DATE(
      "Appointment start date cannot be after or equal with end date"),
  APPOINTMENT_OVERLAPS_WITH_ANOTHER_APPOINTMENT("Appointment overlaps with another appointment"),
  APPOINTMENT_MUST_START_AND_END_ON_A_QUARTER("Appointment must start and end on a quarter"),
  APPOINTMENT_IN_THE_PAST("Appointment date cannot be in the past"),
  APPOINTMENT_NOT_FOUND("Appointment not found"),
  APPOINTMENT_CONFIRMED_SUCCESSFULLY("Appointment confirmed successfully"),
  APPOINTMENT_ALREADY_CONFIRMED("Appointment already confirmed"),
  APPOINTMENT_STATUS_CHANGED_SUCCESSFULLY("Appointment status changed successfully"),
  APPOINTMENT_OVERLAP("Appointment overlaps with another appointment"),
  DOCTOR_NOT_AVAILABLE("Doctor is not available at this time"),
  INVALID_DATE_FORMAT("Invalid date format"),
  INVALID_DATE_RANGE("Invalid date range"),
  PATIENT_DOCTOR_CLINIC_MISMATCH("Patient, doctor and clinic do not match"),
  APPOINTMENT_CREATED_SUCCESSFULLY("Appointment created successfully"),
  APPOINTMENT_UPDATED_SUCCESSFULLY("Appointment updated successfully"),
  DATE_CANNOT_BE_IN_THE_PAST("Date cannot be in the past"),
  APPOINTMENT_ALREADY_CANCELLED("Appointment already cancelled"),
  APPOINTMENT_CANCELLED_SUCCESSFULLY("Appointment cancelled successfully"),
  APPOINTMENT_CANNOT_BE_CANCELLED("Appointment cannot be cancelled"),
  APPOINTMENT_RESCHEDULED_SUCCESSFULLY("Appointment rescheduled successfully"),
  DOCTOR_NOT_WORKING_AT_THIS_TIME("Doctor is not working at this time"),
  NOT_ALLOWED_TO_CHANGE_APPOINTMENT_STATUS("Not allowed to change appointment status");

  private final String message;

  AppointmentMessagesEnum(String message) {
    this.message = message;
  }

  public String getMessage() {
    return message;
  }
}
