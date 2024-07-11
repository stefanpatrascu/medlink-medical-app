import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormLabelComponent } from '@shared/components/form-label/form-label.component';
import { InputTextModule } from 'primeng/inputtext';
import { InvalidFieldDirective } from '@shared/directives/invalid-field.directive';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DateTime } from 'luxon';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { IDropdown } from '@interfaces/dropdown.interface';
import { RolesEnum } from '@enums/roles.enum';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserService } from '@services/user/user.service';
import { Observable } from 'rxjs';
import { SpecializationEnum } from '@enums/users/specialization.enum';
import { EmployeeTypeEnum } from '@enums/users/employee-type.enum';
import { ClinicService } from '@services/clinic/clinic.service';
import { ICreateUser, IEmployeeWorkProgram } from '@interfaces/users/create-user.interface';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUserGrid } from '@interfaces/users/users-grid.interface';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-create-update-user',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    FormLabelComponent,
    FormsModule,
    InputTextModule,
    InvalidFieldDirective,
    MessageModule,
    PasswordModule,
    ReactiveFormsModule,
    RouterLink,
    CheckboxModule,
    JsonPipe,
    DropdownModule,
    MultiSelectModule,
    AsyncPipe,
    ProgressSpinnerModule,
    ConfirmDialogModule
  ],
  templateUrl: './create-update-user.component.html',
  styleUrl: './create-update-user.component.scss'
})
export class CreateUpdateUserComponent implements OnInit, AfterViewInit {

  form!: FormGroup;
  maxDate: Date = new Date();
  error: string | null = null;
  loading: boolean = false;
  weekDays: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  specializations$: Observable<IDropdown<SpecializationEnum>[]> = this.userService.getAllSpecializations();
  employeeTypes$: Observable<IDropdown<EmployeeTypeEnum>[]> = this.userService.getEmployeeTypes();
  clinics$: Observable<IDropdown<number>[]> = this.clinicService.getAllClinics();
  workProgramIsDefined: boolean = false;
  allowUpdatePassword: boolean = true;
  maxTableWidth: number = 0;

  @HostListener('window:resize')
  onResize(): void {
    this.maxTableWidth = window.innerWidth / 1.1;
  }

  roles: IDropdown<RolesEnum>[] = [
    {
      label: 'Admin',
      key: RolesEnum.ADMIN
    },
    {
      label: 'Patient',
      key: RolesEnum.PATIENT
    },
    {
      label: 'Front Desk',
      key: RolesEnum.FRONT_DESK
    },
    {
      label: 'Doctor',
      key: RolesEnum.DOCTOR
    }
  ];


  allowedTextRegex: string = '[a-zA-ZăĂâÂșȘțȚîÎ\\s-]+';

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private clinicService: ClinicService,
              private userService: UserService,
              private messageService: MessageService,
              private dialogRef: DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig<IUserGrid>
  ) {
  }

  ngAfterViewInit(): void {
    this.maxTableWidth = window.innerWidth / 1.1;
  }

  ngOnInit(): void {
    this.generateReactiveForm();
    this.onChangeIsEmployee();
    this.onFormChanges();
    this.populateForm();
  }

  populateForm() {
    if (!this.dialogConfig.data?.id) {
      return;
    }
    this.userService.getUserById(this.dialogConfig.data.id).subscribe(user => {

      this.allowUpdatePassword = false;
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();

      this.form.patchValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.rolesList,
        isEmployee: user.employee !== null,
        cnp: user.cnp,
        phoneNumber: user.phoneNumber,
        dateOfBirth: DateTime.fromSQL(user.dateOfBirth).toJSDate(),
        enabled: user.enabled
      });

      if (user.prefix) {
        this.form.patchValue({
          prefix: user.prefix.trim()
        });
      }

      if (user.employee) {
        this.form.patchValue({
          clinicId: user.employee.clinic.id,
          employeeType: user.employee.employeeType,
          specialization: user.employee.specialization,
          hireDate: DateTime.fromSQL(user.employee.hireDate).toJSDate()
        });
        const workHoursMap = new Map<string, any>();
        for (const workProgram of user.employee.workPrograms) {
          const day = workProgram.day.toLowerCase();
          workHoursMap.set(day, {
            startHour: DateTime.fromFormat(workProgram.startTime, 'HH:mm').toJSDate(),
            endHour: DateTime.fromFormat(workProgram.endTime, 'HH:mm').toJSDate(),
            isWorking: true
          });
        }
        this.form.get('workingHours')?.patchValue(Object.fromEntries(workHoursMap));
      }
    });
  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(() => {
      const userReq: ICreateUser = this.createUserRequest();
      if (userReq && userReq.employee) {
        this.workProgramIsDefined = userReq.employee.workProgramWeek.length > 0;
      } else {
        this.workProgramIsDefined = false;
      }
    });
  }

  onChangeIsEmployee(): void {
    this.form.get('isEmployee')?.valueChanges.subscribe(isEmployee => {
      if (isEmployee) {
        this.form.get('clinicId')?.setValidators(Validators.required);
        this.form.get('employeeType')?.setValidators(Validators.required);
        this.form.get('specialization')?.setValidators(Validators.required);
        this.form.get('hireDate')?.setValidators(Validators.required);
      } else {
        this.form.get('clinicId')?.clearValidators();
        this.form.get('employeeType')?.clearValidators();
        this.form.get('specialization')?.clearValidators();
        this.form.get('hireDate')?.clearValidators();
      }
      this.form.get('clinicId')?.updateValueAndValidity();
      this.form.get('employeeType')?.updateValueAndValidity();
      this.form.get('specialization')?.updateValueAndValidity();
      this.form.get('hireDate')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    this.loading = true;

    const userId: number | undefined = this.dialogConfig.data?.id;

    if (userId) {
      this.userService.updateUser(userId, this.createUserRequest()).subscribe(() => {
        this.loading = false;
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'User updated successfully'});
        this.dialogRef.close(true);
      });
    } else {
      this.userService.addUser(this.createUserRequest()).subscribe(() => {
        this.loading = false;
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'User created successfully'});
        this.dialogRef.close(true);
      });
    }
  }

  createUserRequest(): ICreateUser {
    const request: ICreateUser = {
      email: this.form.value.email,
      roles: this.form.value.roles,
      enabled: this.form.value.enabled,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      cnp: this.form.value.cnp,
      phoneNumber: this.form.value.phoneNumber,
      dateOfBirth: DateTime.fromJSDate(this.form.value.dateOfBirth).toSQLDate() as string,
      isEmployee: this.form.value.isEmployee,
    }

    if (this.form.value.isEmployee) {
      request.prefix = this.form.value.prefix?.trim() + ' ';
    } else {
      request.prefix = null;
    }

    if (this.allowUpdatePassword) {
      request.password = this.form.value.password;
    }

    if (this.form.value.isEmployee) {
      const workProgramWeek: IEmployeeWorkProgram[] = [];

      for (const day of this.weekDays) {
        if (this.form.value.workingHours[day].isWorking) {
          workProgramWeek.push({
            day: this.weekDays.indexOf(day),
            startTime: DateTime.fromJSDate(this.form.value.workingHours[day].startHour).toFormat('HH:mm:ss'),
            endTime: DateTime.fromJSDate(this.form.value.workingHours[day].endHour).toFormat('HH:mm:ss')
          });
        }
      }

      request.employee = {
        clinicId: this.form.value.clinicId,
        employeeType: this.form.value.employeeType,
        specialization: this.form.value.specialization,
        hireDate: DateTime.fromJSDate(this.form.value.hireDate).toSQLDate() as string,
        workProgramWeek: workProgramWeek
      }
    }
    return request;
  }

  private generateReactiveForm(): void {

    this.form = this.formBuilder.group({
      prefix: new FormControl<string | null>(null),
      enabled: new FormControl<boolean>(false),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      roles: new FormControl<string[] | null>(null, Validators.required),
      password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
      firstName: new FormControl<string | null>(null, [Validators.pattern(this.allowedTextRegex), Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      lastName: new FormControl<string | null>(null, [Validators.pattern(this.allowedTextRegex), Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      cnp: new FormControl<string | null>(null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(13), Validators.maxLength(13)]),
      phoneNumber: new FormControl<string | null>(null, [Validators.required]),
      dateOfBirth: new FormControl<string | null>(null, Validators.required),
      isEmployee: new FormControl<boolean>(false),
      clinicId: new FormControl<number | null>(null),
      employeeType: new FormControl<number | null>(null),
      specialization: new FormControl<string[] | null>(null),
      hireDate: new FormControl<string[] | null>(null),
    });

    const formGroup: FormGroup = new FormGroup({});
    for (const day of this.weekDays) {
      formGroup.addControl(day,
        new FormGroup({
          startHour: new FormControl<Date | null>(DateTime.now().set({
            hour: 8,
            minute: 0
          }).toJSDate()),
          endHour: new FormControl<Date | null>(DateTime.now().set({
            hour: 16,
            minute: 0
          }).toJSDate()),
          isWorking: new FormControl<boolean>(false)
        })
      );
    }
    this.form.addControl('workingHours', formGroup);
    this.cdr.detectChanges();
  }
}
