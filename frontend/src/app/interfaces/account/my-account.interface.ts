import { RolesEnum } from '@enums/roles.enum';

export interface IMyAccount {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: RolesEnum[];
}
