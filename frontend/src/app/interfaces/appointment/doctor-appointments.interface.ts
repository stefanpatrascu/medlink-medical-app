export interface IViewAppointmentAsDoctor {
  id: number;
  patient: {
    cnp: string;
    email: string;
    dateOfBirth: string;
    fullName: string;
    id: number;
    phoneNumber: string;
  };
  doctor: {
    fullName: string;
    id: number;
    email: string;
    phoneNumber: string;
    speciality: string;
  };
  clinic: {
    id: number;
    name: string;
  };
  appointmentStartDate: string;
  appointmentEndDate: string;
  status: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  createdAt: string;
  startDateIsInPast?: boolean;
  observations: null | string;
  recommendations: null | string;
}
