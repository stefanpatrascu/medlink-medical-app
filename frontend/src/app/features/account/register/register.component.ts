import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../services/login/account.service';
import { markAsTouched } from '../../../utils/form-touched.util';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { RoutePathEnum } from 'src/app/enums/route-path.enum';
import { InputTextModule } from 'primeng/inputtext';
import { InvalidFieldDirective } from '@shared/directives/invalid-field.directive';
import { FormLabelComponent } from '@shared/components/form-label/form-label.component';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    InputTextModule,
    InvalidFieldDirective,
    ReactiveFormsModule,
    FormLabelComponent,
    MessageModule,
    ButtonModule,
    LogoComponent,
    ProgressSpinnerModule,
    CalendarModule,
    PasswordModule,
    RouterModule
  ]
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  maxDate: Date = new Date();
  error: string | null = null;
  loading: boolean = false;

  allowedTextRegex: string = '[a-zA-ZăĂâÂșȘțȚîÎ\\s-]+';

  constructor(private formBuilder: FormBuilder,
              private loginService: AccountService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.generateReactiveForm();
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      markAsTouched(this.form)
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.loginService.register(this.form.value)
    .subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([RoutePathEnum.LOGIN_PATH],
          {
            queryParams: {
              accountCreated: true
            }
          });
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        if (error.status === 409) {
          this.error = 'An account with the email or CNP already exists';
        } else {
          this.error = 'An error occurred. Please try again later';
        }
      }
    });
  }

  private generateReactiveForm(): void {

    this.form = this.formBuilder.group({
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
      firstName: new FormControl<string | null>(null, [Validators.pattern(this.allowedTextRegex), Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      lastName: new FormControl<string | null>(null, [Validators.pattern(this.allowedTextRegex), Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      cnp: new FormControl<string | null>(null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(13), Validators.maxLength(13)]),
      phoneNumber: new FormControl<string | null>(null, [Validators.required, Validators.pattern('^\\+?[0-9]{10,12}$')]),
      country: new FormControl<string | null>('Romania', Validators.required), // not editable
      address: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      dateOfBirth: new FormControl<string | null>(null, Validators.required),
      county: new FormControl<string | null>(null, [Validators.pattern(this.allowedTextRegex), Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      city: new FormControl<string | null>(null, [Validators.pattern(this.allowedTextRegex), Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      postalCode: new FormControl<string | null>(null, [Validators.required, Validators.pattern('^[0-9]{6}$'), Validators.maxLength(10)]),
    });
  }
}
