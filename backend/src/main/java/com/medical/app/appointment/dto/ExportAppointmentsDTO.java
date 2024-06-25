package com.medical.app.appointment.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ExportAppointmentsDTO {

  private Long id;
  private String patientName;
  private String status;
  private String patientEmail;
  private String patientPhone;
  private String doctorName;
  private String appointmentDate;
  private String appointmentStartTime;
  private String appointmentEndTime;
}
