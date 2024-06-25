import { SpecializationEnum } from '@enums/users/specialization.enum';
import { IDoctorProgram } from '@interfaces/appointment/doctor-programs.interface';
import { IClinic } from '@interfaces/clinic/clinic.interface';


export interface IDoctor {
  id: number;
  fullName: string;
  specialization: SpecializationEnum;
  clinic: IClinic;
  workProgram: IDoctorProgram[];
}
