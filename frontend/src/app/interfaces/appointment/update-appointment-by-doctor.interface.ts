import { ICreatAppointmentByDoctor } from './create-appointment-by-doctor.interface';

export interface IUpdateAppointmentByDoctor extends Partial<ICreatAppointmentByDoctor> {
  observations: string;
  recommendations: string;
}
