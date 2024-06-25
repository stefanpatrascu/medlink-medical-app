package com.medical.app.account.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AppointmentsCount {

  private Long totalAppointments;
  private Long totalConfirmedAppointments;
  private Long totalCancelledAppointments;
  private Long totalCompletedAppointments;
  private Long totalRequestedAppointments;
}
