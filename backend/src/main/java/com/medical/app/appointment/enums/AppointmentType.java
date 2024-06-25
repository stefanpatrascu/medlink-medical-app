package com.medical.app.appointment.enums;

public enum AppointmentType {
  SPECIALIST("Specialist"),
  EMERGENCY("Emergency"),
  OTHER("Other");

  private final String description;

  AppointmentType(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
