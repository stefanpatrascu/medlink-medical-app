import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { ClinicService } from 'src/app/services/clinic/clinic.service';
import { UserService } from 'src/app/services/user/user.service';
import { IDropdown } from '../../../interfaces/dropdown.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDoctor } from '../../../interfaces/users/doctor.interface';
import * as luxon from 'luxon';
import { ISpot } from '../../../interfaces/appointment/doctor-spot.interface';
import { take } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormLabelComponent } from '../../components/form-label/form-label.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create-appointment-dialog',
  templateUrl: './create-appointment-dialog.component.html',
  styleUrl: './create-appointment-dialog.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormLabelComponent,
    DropdownModule,
    CalendarModule
  ]
})
export class CreateAppointmentDialogComponent implements OnInit {

  allSpecializations: IDropdown<string>[] = []; //
  clinics: IDropdown<number>[] = [];
  allDoctors: IDoctor[] = [];
  tomorrowDate: Date = luxon.DateTime.now().plus({days: 1}).toJSDate();
  maxDate: Date = luxon.DateTime.now().plus({month: 1}).toJSDate();
  availableSpots: ISpot[] = [];
  filteredDoctors: IDoctor[] = [];
  filteredSpecializations: IDropdown<string>[] = [];

  form: FormGroup | undefined;
  selectedSpot: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private appointmentService: AppointmentService,
    private clinicService: ClinicService,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef) {
  }

  ngOnInit(): void {
    this.generateReactiveForm();

    this.populateClinics();
    this.populateDoctors();

    this.form?.valueChanges.subscribe((): void => {
      this.checkAvailability();
    });
  }

  onSelectSpot(startTime: string, endTime: string): void {
    this.form?.get('startTime')?.setValue(startTime);
    this.form?.get('endTime')?.setValue(endTime);
  }

  checkAvailability(): void {
    this.selectedSpot = null;
    if (this.form?.value.doctorId && this.form?.value.appointmentDate) {
      this.appointmentService.getDoctorSpots(this.form?.value.doctorId,
        String(luxon.DateTime.fromJSDate(this.form?.value.appointmentDate).toISODate()))
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

  populateDoctors() {
    this.userService.getAllDoctors()
    .pipe(
      take(1)
    )
    .subscribe((response: IDoctor[]) => {
      this.allSpecializations = this.userService.mapSpecializationsFromDoctors(response);
      this.allDoctors = response;
    });
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

  onSubmit(): void {

    if (!this.form?.valid) {
      return;
    }

    this.appointmentService.createAppointmentByPatient(
      this.form?.value.appointmentDate,
      this.form?.value.clinic.key,
      this.form?.value.doctorId,
      this.form?.value.startTime,
      this.form?.value.endTime
    )
    .pipe(
      take(1)
    )
    .subscribe(() => {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Appointment created successfully'});
      this.dialogRef.close();
    });

  }


  private generateReactiveForm() {
    this.form = this.fb.group({
      appointmentDate: new FormControl<string | null>(null, Validators.required),
      specialization: new FormControl<string | null>(null, Validators.required),
      clinic: new FormControl<number | null>(null, Validators.required),
      doctorId: new FormControl<number | null>(null, Validators.required),
      startTime: new FormControl<string | null>(null, Validators.required),
      endTime: new FormControl<string | null>(null, Validators.required)
    });
  }

}
