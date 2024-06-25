
export interface IMyAppointments {
  id: number;
  appointmentStartDate: string;
  appointmentEndDate: string;
  status: string;
  clinicName: string;
  clinicId: number;
  createdAt: string;
  doctorFullName: string;
  doctorId: number;
  startDateIsInPast?: boolean;
}
