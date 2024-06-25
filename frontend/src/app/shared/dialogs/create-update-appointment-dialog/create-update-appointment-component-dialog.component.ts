import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { UserService } from 'src/app/services/user/user.service';
import { take } from 'rxjs';
import { IDoctor } from '../../../interfaces/users/doctor.interface';
import { IPatient } from '../../../interfaces/users/patient.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICalendarInterval } from '../../../interfaces/calendar/month-interval.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { appointmentEndDateValidator } from 'src/app/shared/validators/appointment-end-date.validator';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { ClinicService } from 'src/app/services/clinic/clinic.service';
import { IDropdown } from 'src/app/interfaces/dropdown.interface';
import { AppointmentStatusEnum } from '../../../enums/appointment-status.enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MessageService } from 'primeng/api';
import { FormLabelComponent } from '../../components/form-label/form-label.component';
import { MessageModule } from 'primeng/message';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@UntilDestroy()
@Component({
  selector: 'app-create-appointment-from-calendar-dialog',
  templateUrl: './create-update-appointment-component-dialog.component.html',
  styleUrl: './create-update-appointment-component-dialog.component.scss',
  standalone: true,
  imports: [
    FormLabelComponent,
    MessageModule,
    CalendarModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule
  ]
})
export class CreateUpdateAppointmentComponentDialogComponent implements OnInit {
  error: string | null = null;
  allStatuses: IDropdown<AppointmentStatusEnum>[] = [
    {label: 'Requested', key: AppointmentStatusEnum.REQUESTED},
    {label: 'Completed', key: AppointmentStatusEnum.COMPLETED},
    {label: 'Confirmed', key: AppointmentStatusEnum.CONFIRMED},
    {label: 'Cancelled', key: AppointmentStatusEnum.CANCELED},
  ];
  allPatients: IPatient[] = [];
  allDoctors: IDoctor[] = [];
  filteredDoctors: IDoctor[] = [];
  todayDate: Date = DateTime.now().toJSDate();
  clinics: IDropdown<number>[] = [];
  form: FormGroup | undefined;

  constructor(private userService: UserService,
              private appointmentService: AppointmentService,
              private clinicService: ClinicService,
              private dialogRef: DynamicDialogRef,
              private messageService: MessageService,
              private dialogConfig: DynamicDialogConfig<{
                weekInterval: ICalendarInterval
                doctorId: number,
                clinicId: number,
                patientId: number,
                appointmentId: number,
                status: AppointmentStatusEnum
              }>) {
  }


  onClinicChange(clinicId: number): void {
    this.filteredDoctors = this.allDoctors.filter((doctor: IDoctor) => doctor.clinic.id === clinicId);
    this.form?.get('doctorId')?.reset();
  }

  onSubmit() {
    if (this.dialogConfig.data?.appointmentId) {
      this.updateAppointment();
    } else {
      this.createAppointment();
    }
  }

  createAppointment(): void {
    if (this.form?.valid) {
      this.appointmentService.createAppointmentByDoctor(
        {
          clinicId: this.form?.value.clinicId,
          patientId: this.form?.value.patientId,
          doctorId: this.form?.value.doctorId,
          status: this.form?.value.status,
          appointmentStartDate: this.form?.value.startTime,
          appointmentEndDate: this.form?.value.endTime
        })
      .pipe(
        take(1),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.dialogRef.close(true);
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Appointment created successfully'});
      });
    }
  }

  updateAppointment(): void {
    if (this.form?.valid && this.dialogConfig.data?.appointmentId) {
      this.appointmentService.updateAppointmentByDoctor(
        this.dialogConfig.data.appointmentId,
        {
          clinicId: this.form?.value.clinicId,
          patientId: this.form?.value.patientId,
          doctorId: this.form?.value.doctorId,
          status: this.form?.value.status,
          appointmentStartDate: this.form?.value.startTime,
          appointmentEndDate: this.form?.value.endTime
        })
      .pipe(
        take(1),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Appointment updated successfully'});
        this.dialogRef.close(true);
      });
    }
  }

  ngOnInit(): void {
    this.generateReactiveForm();
    this.populatePatients();
    this.populateClinics();
    this.populateDoctors();
    this.onChangeStartTime();
  }


  onChangeStartTime() {
    if (this.form) {
      this.form.get('startTime')?.valueChanges.subscribe((value) => {
        // update the end time to be the same as the start time + 30 minutes
        this.form?.get('endTime')?.setValue(DateTime.fromJSDate(value)
        .plus({minutes: 30}).toJSDate());

        this.markFieldsAsTouched();
      });
    }
  }

  generateReactiveForm(): void {
    if (!this.dialogConfig.data) {
      return;
    }
    this.form = new FormGroup({
      status: new FormControl(this.dialogConfig.data?.status, Validators.required),
      patientId: new FormControl(this.dialogConfig.data?.patientId, Validators.required),
      doctorId: new FormControl(this.dialogConfig.data?.doctorId, Validators.required),
      clinicId: new FormControl(this.dialogConfig.data?.clinicId || null, Validators.required),
      startTime: new FormControl(this.dialogConfig.data?.weekInterval.startDate.toJSDate(), [Validators.required]),
      endTime: new FormControl(this.dialogConfig.data?.weekInterval.endDate.toJSDate(), [
        Validators.required,
        appointmentEndDateValidator('startTime')
      ]),
    });
    this.markFieldsAsTouched();
  }

  markFieldsAsTouched(): void {
    this.form?.get('startTime')?.markAsTouched();
    this.form?.get('startTime')?.markAsDirty();
    this.form?.get('endTime')?.markAsTouched();
    this.form?.get('endTime')?.markAsDirty();
  }

  populateClinics() {
    this.clinicService.getAllClinics()
    .pipe(
      take(1)
    )
    .subscribe((response) => {
      this.clinics = response;
    });
  }

  populatePatients() {
    this.userService.getAllPatients()
    .pipe(
      take(1)
    )
    .subscribe((response: IPatient[]) => {
      this.allPatients = response.filter((patient: IPatient): boolean => patient.id !== this.dialogConfig.data?.doctorId);
    });
  }

  populateDoctors() {
    this.userService.getAllDoctors()
    .pipe(
      take(1)
    )
    .subscribe((response: IDoctor[]) => {
      this.allDoctors = response;
      this.filteredDoctors = this.allDoctors.filter((doctor: IDoctor) => doctor.clinic.id === this.form?.value.clinicId);
    });
  }

}
