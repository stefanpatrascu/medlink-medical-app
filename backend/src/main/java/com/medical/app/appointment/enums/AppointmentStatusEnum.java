
package com.medical.app.appointment.enums;

public enum AppointmentStatusEnum {
  REQUESTED("Requested"),
  CONFIRMED("Confirmed"),
  CANCELED("Canceled"),
  COMPLETED("Completed");

  private final String description;

  AppointmentStatusEnum(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
