export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cnp: string;
  phoneNumber: string;
  country: string;
  address: string;
  dateOfBirth: Date | string | null;
  county: string;
  city: string;
  postalCode: string;
}
