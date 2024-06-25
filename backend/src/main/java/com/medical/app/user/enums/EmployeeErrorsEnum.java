package com.medical.app.user.enums;

public enum EmployeeErrorsEnum {
  USER_ALREADY_EXISTS_WITH_SAME_EMAIL_OR_CNP("User with the same email or CNP already exists"),
  INVALID_START_TIME_OR_END_TIME("Invalid start time or end time"),
  CLINIC_NOT_FOUND("Clinic not found"),
  CANNOT_DELETE_YOURSELF("You cannot delete yourself");

  private final String message;

  EmployeeErrorsEnum(String message) {
    this.message = message;
  }
}
