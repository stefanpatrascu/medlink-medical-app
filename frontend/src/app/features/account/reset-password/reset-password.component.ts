import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { markAsTouched } from '../../../utils/form-touched.util';
import { AccountService } from 'src/app/services/login/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RoutePathEnum } from 'src/app/enums/route-path.enum';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InvalidFieldDirective } from '@shared/directives/invalid-field.directive';
import { FormLabelComponent } from '@shared/components/form-label/form-label.component';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

enum FieldToDisplayEnum {
  REQUEST_NEW_PASSWORD = 'requestNewPassword',
  VALIDATE_OTP = 'validateOtp',
  SET_NEW_PASSWORD = 'setNewPassword'
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  standalone: true,
  imports: [
    InputTextModule,
    InvalidFieldDirective,
    ReactiveFormsModule,
    FormLabelComponent,
    MessageModule,
    ButtonModule,
    InputOtpModule,
    LogoComponent,
    ProgressSpinnerModule
  ]
})
export class ResetPasswordComponent implements OnInit {
  readonly fieldToDisplayEnum = FieldToDisplayEnum;

  requestNewPasswordForm!: FormGroup;
  validateOtpForm!: FormGroup;
  newPassForm!: FormGroup;
  loading: boolean = false;

  formToDisplay: string = FieldToDisplayEnum.REQUEST_NEW_PASSWORD;

  error: string | null = null;
  success: string | null = null;


  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router) {
  }

  onResetPassword(): void {
    this.error = null;
    if (this.newPassForm.invalid) {
      markAsTouched(this.newPassForm);
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.newPassForm.value.password !== this.newPassForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.accountService.changePassword(this.requestNewPasswordForm.value.email, this.newPassForm.value.password, this.validateOtpForm.value.otp)
    .subscribe({
      next: (): void => {
        this.loading = false;
        this.error = null;
        this.router.navigate([RoutePathEnum.LOGIN_PATH], {
          queryParams: {
            passwordChanged: true
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.error = 'Password cannot be changed. Please try again later';
        } else {
          this.error = 'Something went wrong';
        }
        this.loading = false;
      }
    });
  }

  onValidateOtp(): void {
    this.error = null;
    if (this.validateOtpForm.invalid) {
      markAsTouched(this.validateOtpForm);
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.accountService.validateOtp(this.requestNewPasswordForm.value.email, this.validateOtpForm.value.otp)
    .subscribe({
      next: (): void => {
        this.formToDisplay = FieldToDisplayEnum.SET_NEW_PASSWORD;
        this.loading = false;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.error = 'The code is invalid';
        } else {
          this.error = 'Something went wrong';
        }
        this.loading = false;
      }
    });

  }

  requestNewCode(): void {
    this.loading = true;
    this.accountService.requestNewPassword(this.requestNewPasswordForm.value.email)
    .subscribe({
      next: (): void => {
        this.success = 'New code sent';
        this.loading = false;
        this.error = null;
      },
      error: (): void => {
        this.loading = false;
        this.success = null;
        this.error = 'Something went wrong';
      }
    });
  }

  onRequestNewPassword(): void {
    if (this.requestNewPasswordForm.invalid) {
      markAsTouched(this.requestNewPasswordForm);
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.accountService.requestNewPassword(this.requestNewPasswordForm.value.email)
    .subscribe({
      next: (): void => {
        this.formToDisplay = FieldToDisplayEnum.VALIDATE_OTP;
        this.loading = false;
        this.error = null;
      },
      error: (): void => {
        this.loading = false;
        this.error = 'Something went wrong';
      }
    });
  }

  ngOnInit(): void {
    this.generateReactiveForm();
  }

  generateReactiveForm(): void {
    this.requestNewPasswordForm = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
    this.validateOtpForm = this.fb.group({
      otp: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    });
    this.newPassForm = this.fb.group({
      password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
      confirmPassword: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
    });
  }
}
