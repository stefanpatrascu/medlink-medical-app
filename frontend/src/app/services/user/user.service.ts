import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsersPathEnum } from '../../enums/users/users-path.enum';
import { IDoctor } from '../../interfaces/users/doctor.interface';
import { Observable, of } from 'rxjs';
import { IDropdown } from 'src/app/interfaces/dropdown.interface';
import { IPatient } from '../../interfaces/users/patient.interface';
import { IGenericGridApiRequest } from '@interfaces/grid/generic-grid-api-request.interface';
import { GenericApiResponse } from '@interfaces/grid/generic-grid-api-response.interface';
import { IUserGrid } from '@interfaces/users/users-grid.interface';
import { ICreateUser } from '@interfaces/users/create-user.interface';
import { SpecializationEnum } from '@enums/users/specialization.enum';
import { EmployeeTypeEnum } from '@enums/users/employee-type.enum';
import { IUserInfo } from '@interfaces/users/user-info.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly path: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getUserById(id: number): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${this.path}/${UsersPathEnum.USERS}/${id.toString()}`);
  }

  getAllUsers(request: IGenericGridApiRequest): Observable<GenericApiResponse<IUserGrid>> {
    return this.http.post<GenericApiResponse<IUserGrid>>(`${this.path}/${UsersPathEnum.USERS}/${UsersPathEnum.ALL}`, request);
  }

  getAllDoctors(): Observable<IDoctor[]> {
    return this.http.get<IDoctor[]>(`${this.path}/${UsersPathEnum.USERS}/${UsersPathEnum.ALL_DOCTORS}`);
  }

  getDoctorById(id: number): Observable<IDoctor> {
    return this.http.get<IDoctor>(`${this.path}/${UsersPathEnum.USERS}/${UsersPathEnum.DOCTOR}/${id.toString()}`);
  }

  getAllPatients(): Observable<IPatient[]> {
    return this.http.get<IPatient[]>(`${this.path}/${UsersPathEnum.USERS}/${UsersPathEnum.ALL_PATIENTS}`);
  }

  addUser(req: ICreateUser) {
    return this.http.post(`${this.path}/${UsersPathEnum.USERS}/${UsersPathEnum.CREATE}`, req);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.path}/${UsersPathEnum.USERS}/${UsersPathEnum.DELETE}/${userId.toString()}`);
  }

  updateUser(userId: number, req: ICreateUser) {
    return this.http.put(`${this.path}/${UsersPathEnum.USERS}/${UsersPathEnum.UPDATE}/${userId.toString()}`, req);
  }

  getEmployeeTypes(): Observable<IDropdown<EmployeeTypeEnum>[]> {
    return of([
      {
        key: EmployeeTypeEnum.DOCTOR,
        label: 'Doctor'
      },
      {
        key: EmployeeTypeEnum.ADMINISTRATIVE,
        label: 'Administrative'
      },
      {
        key: EmployeeTypeEnum.NURSE,
        label: 'Nurse'
      },
      {
        key: EmployeeTypeEnum.IT,
        label: 'IT'
      },
      {
        key: EmployeeTypeEnum.OTHER,
        label: 'Other'
      }
    ]);
  }

  getAllSpecializations(): Observable<IDropdown<SpecializationEnum>[]> {
    return of([
      {
        key: SpecializationEnum.NONE,
        label: 'None'
      },
      {
        key: SpecializationEnum.CARDIOLOGY,
        label: 'Cardiology'
      },
      {
        key: SpecializationEnum.DERMATOLOGY,
        label: 'Dermatology'
      },
      {
        key: SpecializationEnum.ENDOCRINOLOGY,
        label: 'Endocrinology'
      },
      {
        key: SpecializationEnum.GASTROENTEROLOGY,
        label: 'Gastroenterology'
      },
      {
        key: SpecializationEnum.GYNECOLOGY,
        label: 'Gynecology'
      },
      {
        key: SpecializationEnum.HEMATOLOGY,
        label: 'Hematology'
      },
      {
        key: SpecializationEnum.NEPHROLOGY,
        label: 'Nephrology'
      },
      {
        key: SpecializationEnum.NEUROLOGY,
        label: 'Neurology'
      },
      {
        key: SpecializationEnum.ONCOLOGY,
        label: 'Oncology'
      },
      {
        key: SpecializationEnum.OPHTHALMOLOGY,
        label: 'Ophthalmology'
      },
      {
        key: SpecializationEnum.ORTHOPEDICS,
        label: 'Orthopedics'
      },
      {
        key: SpecializationEnum.OTOLARYNGOLOGY,
        label: 'Otolaryngology'
      },
      {
        key: SpecializationEnum.PEDIATRICS,
        label: 'Pediatrics'
      },
      {
        key: SpecializationEnum.PSYCHIATRY,
        label: 'Psychiatry'
      },
      {
        key: SpecializationEnum.PULMONOLOGY,
        label: 'Pulmonology'
      },
      {
        key: SpecializationEnum.RHEUMATOLOGY,
        label: 'Rheumatology'
      },
      {
        key: SpecializationEnum.UROLOGY,
        label: 'Urology'
      }
    ]);
  }

  mapSpecializationsFromDoctors(doctors: IDoctor[]): IDropdown<string>[] {
    return doctors.map(doctor => {
      // Convert the first letter of the specialization to uppercase and the rest to lowercase
      const specialization = doctor.specialization.toLocaleLowerCase().split('')
      .map((letter, index) => index === 0 ? letter.toUpperCase() : letter).join('');
      return {
        key: doctor.specialization,
        label: specialization
      };
    })
    .filter((specialization, index, self) => self.findIndex(s => s.key === specialization.key) === index);
  }

}
