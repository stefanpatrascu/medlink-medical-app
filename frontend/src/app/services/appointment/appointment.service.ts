import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppointmentPathEnum } from '../../enums/appointment-path.enum';
import { IMyAppointments } from '../../interfaces/appointment/my-appointments.interface';
import { IGenericGridApiRequest } from '../../interfaces/grid/generic-grid-api-request.interface';
import { GenericApiResponse } from 'src/app/interfaces/grid/generic-grid-api-response.interface';
import * as luxon from 'luxon';
import { DateTime } from 'luxon';
import { ISpot } from '../../interfaces/appointment/doctor-spot.interface';
import { DefaultApiResponse } from '../../interfaces/generic.interface';
import { IViewAppointmentAsDoctor } from '../../interfaces/appointment/doctor-appointments.interface';
import { IDoctorProgram } from '../../interfaces/appointment/doctor-programs.interface';
import { AppointmentStatusEnum } from '../../enums/appointment-status.enum';
import { ICreatAppointmentByDoctor } from '../../interfaces/appointment/create-appointment-by-doctor.interface';
import { IUpdateAppointmentByDoctor } from '../../interfaces/appointment/update-appointment-by-doctor.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly path: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getAllAppointmentsByDoctorAndInterval(doctorId: number, startDate: DateTime, endDate: DateTime): Observable<IViewAppointmentAsDoctor[]> {
    const startDateStr: string | null = startDate.toISO({
      includeOffset: false,
      suppressMilliseconds: true,
      suppressSeconds: true
    });
    const endDateStr: string | null = endDate.toISO({
      includeOffset: false,
      suppressMilliseconds: true,
      suppressSeconds: true
    });

    if (!startDateStr || !endDateStr) {
      throw new Error('Invalid date format');
    }
    const params = new HttpParams().set('doctorId', doctorId).set('startDate', startDateStr).set('endDate', endDateStr);
    return this.http.get<IViewAppointmentAsDoctor[]>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.ALL_DOCTOR_APPOINTMENTS}`, {params})
    .pipe(
      map((appointments: IViewAppointmentAsDoctor[]): IViewAppointmentAsDoctor[] => {
        return appointments.sort((a, b) => {
          return DateTime.fromISO(a.appointmentStartDate).toMillis() - DateTime.fromISO(b.appointmentStartDate).toMillis();
        });
      })
    );
  }

  countByDoctor(): Observable<Record<AppointmentStatusEnum, number>> {
    return this.http.get<Record<AppointmentStatusEnum, number>>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.COUNT_BY_DOCTOR}`, {})
  }

  countAll(): Observable<Record<AppointmentStatusEnum, number>> {
    return this.http.get<Record<AppointmentStatusEnum, number>>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.COUNT_ALL}`, {});
  }

  exportAppointments(request: IGenericGridApiRequest): Observable<HttpResponse<Blob>> {
    return this.http.post<Blob>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.EXPORT}`, request, {
      observe: 'response',
      responseType: 'blob' as 'json'
    });
  }

  getDoctorAppointments(request: IGenericGridApiRequest): Observable<GenericApiResponse<IViewAppointmentAsDoctor>> {
    return this.http.post<GenericApiResponse<IViewAppointmentAsDoctor>>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.ALL_DOCTOR_APPOINTMENTS}`,
      request).pipe(
      map((response: GenericApiResponse<IViewAppointmentAsDoctor>) => {
          response.content = response.content.map((appointment: IViewAppointmentAsDoctor) => {
            appointment.startDateIsInPast = DateTime.fromISO(appointment.appointmentStartDate).toMillis() < DateTime.now().toMillis();
            return appointment;
          });
          return response;
        }
      )
    );
  }

  getMyAppointments(request: IGenericGridApiRequest): Observable<GenericApiResponse<IMyAppointments>> {
    return this.http.post<GenericApiResponse<IMyAppointments>>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.MY_APPOINTMENTS}`,
      request).pipe(
      map((response: GenericApiResponse<IMyAppointments>) => {
          response.content = response.content.map((appointment: IMyAppointments) => {
            appointment.startDateIsInPast = DateTime.fromISO(appointment.appointmentStartDate).toMillis() < DateTime.now().toMillis();
            return appointment;
          });
          return response;
        }
      )
    );
  }

  getAppointmentById(appointmentId: number): Observable<IViewAppointmentAsDoctor> {
    return this.http.get<IViewAppointmentAsDoctor>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.APPOINTMENT}/${appointmentId}`);
  }

  cancelAppointment(appointmentId: number): Observable<DefaultApiResponse> {
    return this.http.put<DefaultApiResponse>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.CANCEL_APPOINTMENT}/${appointmentId}`, {});
  }

  rescheduleAppointment(appointmentId: number, appointmentDate: Date, startTime: string, endTime: string): Observable<DefaultApiResponse> {
    const formatAppointmentDate: string | null = luxon.DateTime.fromJSDate(appointmentDate).toISODate();
    const appointmentStartDate: string = formatAppointmentDate + 'T' + startTime;
    const appointmentEndDate: string = formatAppointmentDate + 'T' + endTime;
    return this.http.put<DefaultApiResponse>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.RESCHEDULE}/${appointmentId}`, {
      appointmentStartDate,
      appointmentEndDate
    });
  }

  getDoctorPrograms(doctorId: number): Observable<IDoctorProgram[]> {
    const params = new HttpParams().set('doctorId', doctorId);
    return this.http.get<IDoctorProgram[]>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.DOCTOR_PROGRAM}`, {params});
  }

  createAppointmentByPatient(appointmentDate: Date, clinicId: number, doctorId: number,
                             startTime: string, endTime: string,): Observable<any> {
    const formatAppointmentDate: string | null = luxon.DateTime.fromJSDate(appointmentDate).toISODate();

    const appointmentStartDate: string = formatAppointmentDate + 'T' + startTime.slice(0, 5);
    const appointmentEndDate: string = formatAppointmentDate + 'T' + endTime.slice(0, 5);

    return this.http.post(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.CREATE}`, {
      appointmentStartDate,
      appointmentEndDate,
      clinicId,
      doctorId,
    });
  }

  createAppointmentByDoctor(request: ICreatAppointmentByDoctor): Observable<any> {
    return this.http.post(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.CREATE_BY_DOCTOR}`, {
      ...request,
      appointmentStartDate: DateTime.fromJSDate(request.appointmentStartDate as Date).toFormat('yyyy-MM-dd\'T\'HH:mm'),
      appointmentEndDate: DateTime.fromJSDate(request.appointmentEndDate as Date).toFormat('yyyy-MM-dd\'T\'HH:mm'),
    });
  }

  updateAppointmentByDoctor(id: number, request: Partial<IUpdateAppointmentByDoctor>): Observable<DefaultApiResponse> {

    if (request.appointmentStartDate) {
      request.appointmentStartDate = DateTime.fromJSDate(request.appointmentStartDate as Date).toFormat('yyyy-MM-dd\'T\'HH:mm');
    }

    if (request.appointmentEndDate) {
      request.appointmentEndDate = DateTime.fromJSDate(request.appointmentEndDate as Date).toFormat('yyyy-MM-dd\'T\'HH:mm');
    }

    return this.http.patch<DefaultApiResponse>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.UPDATE_APPOINTMENT}/${id}`, request);
  }

  getDoctorSpots(doctorId: number, date: string, duration: number = 60): Observable<ISpot[]> {
    const params = new HttpParams().set('doctorId', doctorId).set('date', date)
    .set('duration', duration.toString());
    return this.http.get<ISpot[]>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.ALL_DOCTOR_SPOTS}`, {params});
  }

  getDoctorAvailability(doctorId: number, date: string): Observable<ISpot[]> {
    const params = new HttpParams().set('doctorId', doctorId).set('date', date);
    return this.http.get<ISpot[]>(`${this.path}/${AppointmentPathEnum.APPOINTMENTS}/${AppointmentPathEnum.GET_DOCTOR_AVAILABILITY}`, {params});
  }

}
