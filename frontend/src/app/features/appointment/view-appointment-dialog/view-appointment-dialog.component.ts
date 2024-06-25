import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { DateTime } from 'luxon';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { CreateUpdateAppointmentComponentDialogComponent } from '@shared/dialogs/create-update-appointment-dialog/create-update-appointment-component-dialog.component';
import { IViewAppointmentAsDoctor } from '@interfaces/appointment/doctor-appointments.interface';
import { RolesEnum } from '@enums/roles.enum';
import { AppointmentService } from '@services/appointment/appointment.service';
import { AccountService } from '@services/login/account.service';

@UntilDestroy()
@Component({
  selector: 'app-view-appointment-as-doctor',
  templateUrl: './view-appointment-dialog.component.html',
  styleUrl: './view-appointment-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AccordionModule,
    NgxEditorModule,
    ButtonModule,
    MessageModule
  ]
})
export class ViewAppointmentDialogComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  recommendationsEditor!: Editor;
  observationsEditor!: Editor;
  isManager: boolean = this.accountService.hasAnyRoleSyn([RolesEnum.DOCTOR, RolesEnum.ADMIN, RolesEnum.FRONT_DESK])

  readonly dateTime: typeof DateTime = DateTime;
  readonly toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['undo', 'redo'],
  ];
  appointment: IViewAppointmentAsDoctor | null = null;
  loading: boolean = true;

  constructor(private appointmentService: AppointmentService,
              private dialogConfig: DynamicDialogConfig,
              private accountService: AccountService,
              private dialogService: DialogService,
              private messageService: MessageService,
              private fb: FormBuilder) {
  }

  generateReactiveForm(): void {
    this.form = this.fb.group({
      observations: new FormControl(null, Validators.required),
      recommendations: new FormControl(null, Validators.required),
    });
  }

  populateAppointment(): void {
    this.appointmentService.getAppointmentById(this.dialogConfig.data?.appointmentId)
    .pipe(
      take(1)
    )
    .subscribe((appointment: IViewAppointmentAsDoctor): void => {
      this.appointment = appointment;
      this.form.get('observations')?.setValue(appointment.observations);
      this.form.get('recommendations')?.setValue(appointment.recommendations);
    });
  }

  openUpdateDialog() {
    this.dialogService.open(CreateUpdateAppointmentComponentDialogComponent, {
      header: 'Update Appointment Details',
      width: '700px',
      data: {
        appointmentId: this.appointment?.id,
        doctorId: this.appointment?.doctor.id,
        clinicId: this.appointment?.clinic.id,
        patientId: this.appointment?.patient.id,
        weekInterval: {
          startDate: DateTime.fromISO(this.appointment?.appointmentStartDate ?? ''),
          endDate: DateTime.fromISO(this.appointment?.appointmentEndDate ?? '')
        },
        status: this.appointment?.status,
      }
    }).onClose
    .pipe(
      take(1),
      untilDestroyed(this)
    )
    .subscribe((updated: boolean): void => {
      if (updated) {

        this.populateAppointment();
      }
    });
  }

  calculateAge(birthDateStr: string) {
    const birthDate = DateTime.fromISO(birthDateStr);
    const currentDate = DateTime.now();

    const diff = currentDate.diff(birthDate, ['years', 'months', 'days']).toObject();

    if (diff) {
      return `${Math.floor(diff.years ?? 0)} years, ${Math.floor(diff.months ?? 0)} months, ${Math.floor(diff.days ?? 0)} days`;
    }
    return '-';
  }

  onFieldsChange() {
    this.form.get('observations')?.valueChanges
    .pipe(
      untilDestroyed(this)
    )
    .subscribe((value: string) => {
      if (value === '<p></p>') {
        this.form.get('observations')?.setValue(null, {emitEvent: false});
      }
    });

    this.form.get('recommendations')?.valueChanges
    .pipe(
      untilDestroyed(this)
    ).subscribe((value: string) => {
      if (value === '<p></p>') {
        this.form.get('recommendations')?.setValue(null, {emitEvent: false});
      }
    });
  }

  ngOnInit() {

    this.recommendationsEditor = new Editor();
    this.observationsEditor = new Editor();
    this.populateAppointment();
    this.generateReactiveForm();
    this.onFieldsChange();
  }

  ngOnDestroy() {
    this.recommendationsEditor.destroy();
    this.observationsEditor.destroy();
  }

  update() {
    if (!this.appointment) {
      return;
    }
    this.appointmentService.updateAppointmentByDoctor(this.dialogConfig.data.appointmentId, {
      observations: this.form.get('observations')?.value,
      recommendations: this.form.get('recommendations')?.value
    })
    .pipe(
      take(1),
      untilDestroyed(this)
    ).subscribe(() => {
      this.populateAppointment();
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Appointment updated successfully'});
    });
  }
}
