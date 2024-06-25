import { SpecializationEnum } from '@enums/users/specialization.enum';
import { RolesEnum } from '@enums/roles.enum';

export interface IUserGrid {
  id: number;
  fullName: string;
  cnp: string;
  email: string;
  hireDate: string;
  specialization: SpecializationEnum;
  roles: RolesEnum[];
  lastLogin: string;
  enabled: boolean;
  updatedAt: string | null;
}
