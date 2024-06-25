interface IClinic {
  id: number;
  clinicName: string;
}

interface IWorkProgram {
  day: string;
  startTime: string;
  endTime: string;
}

interface IEmployee {
  id: number;
  employeeType: string;
  specialization: string;
  hireDate: string;
  clinic: IClinic;
  workPrograms: IWorkProgram[];
}

export interface IUserInfo {
  id: number;
  email: string;
  prefix: string;
  enabled: boolean;
  employee: IEmployee;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  cnp: string;
  city?: string | null;
  county?: string | null;
  country?: string | null;
  postalCode?: string | null;
  address?: string | null;
  lastLogin: string;
  rolesList: string[];
}
