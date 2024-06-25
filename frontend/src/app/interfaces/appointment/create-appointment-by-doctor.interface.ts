import { AppointmentStatusEnum } from '@enums/appointment-status.enum';

export interface ICreatAppointmentByDoctor {
  clinicId: number;
  patientId: number;
  doctorId: number;
  status: AppointmentStatusEnum,
  appointmentStartDate: Date | string;
  appointmentEndDate: Date | string;
}
