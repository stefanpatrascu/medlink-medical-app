import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IDropdown } from '../../../interfaces/dropdown.interface';
import { IDoctor } from '../../../interfaces/users/doctor.interface';
import * as luxon from 'luxon';
import { DateTime } from 'luxon';
import { ISpot } from '../../../interfaces/appointment/doctor-spot.interface';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { IMyAppointments } from '../../../interfaces/appointment/my-appointments.interface';
import { IDoctorProgram } from '../../../interfaces/appointment/doctor-programs.interface';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormLabelComponent } from '../../components/form-label/form-label.component';

@Component({
  selector: 'app-reschedule-appointment',
  templateUrl: './reschedule-appointment-dialog.component.html',
  styleUrl: './reschedule-appointment-dialog.component.scss',
  imports: [
    DropdownModule,
    CalendarModule,
    FormLabelComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class RescheduleAppointmentDialogComponent implements OnInit, AfterViewInit {
  allSpecializations: IDropdown<string>[] = [];
  clinics: IDropdown<number>[] = [];
  allDoctors: IDoctor[] = [];
  todayDate: Date = luxon.DateTime.now().toJSDate();
  maxDate: Date = luxon.DateTime.now().plus({month: 1}).toJSDate();
  availableSpots: ISpot[] = [];
  filteredDoctors: IDoctor[] = [];
  filteredSpecializations: IDropdown<string>[] = [];
  doctorPrograms: IDoctorProgram[] = [];
  selectedDoctorProgram: IDoctorProgram | null = null;

  form: FormGroup | undefined;
  selectedSpot: string | null = null;

  get appointmentId(): number {
    return this.dialogConfig.data?.id ?? 0;
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private appointmentService: AppointmentService,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig<IMyAppointments>
  ) {
  }

  populateDoctorProgramByDate(): void {
    if (this.form?.value.appointmentDate) {
      this.selectedDoctorProgram = this.doctorPrograms.find((program: IDoctorProgram) =>
        program.day === DateTime.fromJSDate(this.form?.value.appointmentDate).toFormat('EEEE').toUpperCase()) || null;
    }
  }

  ngOnInit(): void {
    this.generateReactiveForm();
    this.populateDoctorPrograms();

    this.form?.valueChanges.subscribe((): void => {
      this.checkAvailability();
      this.populateDoctorProgramByDate();
    });
  }

  ngAfterViewInit(): void {
    this.populateAppointmentDateOnInit();
  }

  populateDoctorPrograms(): void {
    this.appointmentService.getDoctorPrograms(this.form?.value.doctorId ?? 0)
    .pipe(
      take(1)
    )
    .subscribe((response) => {
      this.doctorPrograms = response;
      this.populateDoctorProgramByDate();
    });
  }

  populateAppointmentDateOnInit(): void {
    if (this.dialogConfig.data?.appointmentStartDate) {
      this.form?.get('appointmentDate')?.setValue(DateTime.fromISO(this.dialogConfig.data?.appointmentStartDate).toJSDate());
      this.checkAvailability();
    }
  }

  onSelectSpot(startTime: string, endTime: string): void {
    this.form?.get('startTime')?.setValue(startTime);
    this.form?.get('endTime')?.setValue(endTime);
  }

  checkAvailability(): void {
    this.selectedSpot = null;
    if (this.form?.value.doctorId && this.form?.value.appointmentDate) {
      this.appointmentService.getDoctorSpots(this.form?.value.doctorId,
        String(luxon.DateTime.fromJSDate(this.form?.value.appointmentDate).toISODate()),
        this.form?.value.consultationDuration
        )
      .pipe(
        take(1)
      )
      .subscribe((response) => {
        this.availableSpots = response;
      }, () => {
        this.availableSpots = [];
      });
    } else {
      this.availableSpots = [];
    }
  }

  onClinicChange(clinic: IDropdown<number>): void {
    this.filteredDoctors = this.allDoctors.filter((doctor: IDoctor) => doctor.clinic.id === clinic.key);
    this.filteredSpecializations = this.userService.mapSpecializationsFromDoctors(this.filteredDoctors);
    this.filteredDoctors = [];
    this.form?.get('doctorId')?.reset();
    this.form?.get('specialization')?.reset();
  }

  onSpecializationChange(specialization: IDropdown<string>): void {
    this.filteredDoctors = this.allDoctors.filter((doctor: IDoctor) => doctor.specialization === specialization.key);
    this.form?.get('doctorId')?.reset();
  }

  onSubmit(): void {
    if (!this.form?.valid || !this.appointmentId) {
      return;
    }

    this.appointmentService.rescheduleAppointment(
      this.appointmentId,
      this.form?.value.appointmentDate,
      this.form?.value.startTime,
      this.form?.value.endTime
    )
    .pipe(
      take(1)
    )
    .subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Appointment rescheduled successfully',
      });
      this.dialogRef.close();
    });

  }


  private generateReactiveForm() {
    if (!this.dialogConfig.data) {
      return;
    }

    this.form = this.fb.group({
      appointmentDate: new FormControl<string | null>(null, Validators.required),
      clinic: new FormControl<number | null>(this.dialogConfig.data.clinicId, Validators.required),
      doctorId: new FormControl<number | null>(this.dialogConfig.data.doctorId, Validators.required),
      startTime: new FormControl<string | null>(null, Validators.required),
      endTime: new FormControl<string | null>(null, Validators.required)
    });
  }

}
