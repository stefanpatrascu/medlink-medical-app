import { RolesEnum } from '@enums/roles.enum';

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  cnp: string;
  phoneNumber: string;
  dateOfBirth: string;
  roles: RolesEnum[];
  employee?: {
    clinicId: number;
    employeeType: number;
    specialization: string;
    hireDate: string;
    workProgramWeek: IEmployeeWorkProgram[];
  };
  prefix?: string | null;
  enabled: boolean;
  isEmployee: boolean;
}

export interface IEmployeeWorkProgram {
  day: number;
  startTime: string;
  endTime: string;
}

