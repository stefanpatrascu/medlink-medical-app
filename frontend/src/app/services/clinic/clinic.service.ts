import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ClinicsPathEnum } from '../../enums/clinic/clinics-path.enum';
import { IClinic } from '../../interfaces/clinic/clinic.interface';
import { IDropdown } from '../../interfaces/dropdown.interface';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  private readonly path: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }
  getAllClinics(): Observable<IDropdown<number>[]> {
    return this.http.get<IClinic[]>(`${this.path}/${ClinicsPathEnum.CLINICS}/${ClinicsPathEnum.ALL}`)
      .pipe(
        map((clinics: IClinic[]) => clinics.map((clinic) => {
          return {
            key: clinic.id,
            label: clinic.clinicName
          };
        }))
      );
  }

}
