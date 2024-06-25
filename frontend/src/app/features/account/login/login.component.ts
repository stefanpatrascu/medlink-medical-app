import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { RoutePathEnum } from '@enums/route-path.enum';
import { markAsTouched } from '@utils/form-touched.util';
import { AccountService } from '@services/login/account.service';
import { InputTextModule } from 'primeng/inputtext';
import { InvalidFieldDirective } from '@shared/directives/invalid-field.directive';
import { FormLabelComponent } from '@shared/components/form-label/form-label.component';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    RouterModule
  ]
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  loading: boolean = false;

  error: string | null = null;
  passwordChanged: boolean = false;
  accountCreated: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.generateReactiveForm();
    this.checkParams();
  }

  checkParams(): void {
    this.route.queryParams
    .pipe(
      take(1)
    ).subscribe(params => {
      this.passwordChanged = Boolean(params['passwordChanged']);
      this.accountCreated = Boolean(params['accountCreated']);
      this.router.navigate([], {
        replaceUrl: true
      }); // remove query params
    });
  }

  goToRegister(): void {
    this.router.navigate([RoutePathEnum.REGISTER_PATH]);
  }

  goToForgotPassword(): void {
    this.router.navigate([RoutePathEnum.FORGOT_PASSWORD_PATH]);
  }

  public onSubmit(): void {
    this.passwordChanged = false;
    this.accountCreated = false;
    if (this.form.invalid) {
      markAsTouched(this.form)
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.accountService.login(this.form.value)
    .subscribe({
      next: (): void => {
        this.router.navigate([
          RoutePathEnum.REDIRECTING_AFTER_LOGIN
        ], {replaceUrl: true});
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        if (error.status === 401) {
          this.error = 'Your email or password is incorrect';
        } else if (error.status === 403) {
          this.error = 'This account has been deactivated';
        } else if (error.status === 423) {
          this.error = 'To many login attempts. Please try again later';
        } else {
          this.error = 'Something went wrong';
        }
      }
    });
  }

  private generateReactiveForm(): void {
    this.form = this.formBuilder.group({
      email: new FormControl<string | null>(null, [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
        )]),
      password: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32)
      ])
    });
  }


}
