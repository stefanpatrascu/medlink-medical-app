import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AccountPathEnum } from '../../enums/account-path.enum';
import { IRegisterRequest } from '../../interfaces/account/register.interface';
import { ILoginRequest } from '../../interfaces/account/login.interface';
import { IMyAccount } from '../../interfaces/account/my-account.interface';
import { DefaultApiResponse } from '../../interfaces/generic.interface';
import * as luxon from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private path: string = environment.apiUrl;
  private cachedAccount$: Observable<IMyAccount> | null = null;
  private account: IMyAccount | null = null;
  constructor(private http: HttpClient) {
  }

  login(request: ILoginRequest): Observable<IMyAccount> {
    return this.http.post<IMyAccount>(`${this.path}/${AccountPathEnum.LOGIN_PATH}`,
      request);
  }

  refreshToken(): Observable<void> {
    return this.http.post<void>(`${this.path}/${AccountPathEnum.ACCOUNT}/${AccountPathEnum.REFRESH}`, {});
  }

  register(request: IRegisterRequest): Observable<DefaultApiResponse> {
    if (request.dateOfBirth) {
      request.dateOfBirth = luxon.DateTime.fromJSDate(new Date(request.dateOfBirth)).toISODate();
    }
    return this.http.post<DefaultApiResponse>(`${this.path}/${AccountPathEnum.REGISTER_PATH}`, request);
  }

  hasAnyRoleSyn(roles: string[]): boolean {
    return Boolean(this.account?.roles.some((role: string): boolean => roles.includes(role)));
  }

  hasAnyRole(roles: string[]): Observable<boolean> {
    return this.myAccount()
    .pipe(
      map((account: IMyAccount) => {
        return Boolean(account.roles.some((role: string): boolean => roles.includes(role)));
      })
    );
  }

  requestNewPassword(email: string): Observable<DefaultApiResponse> {
    const params = new HttpParams().set('email', email);
    return this.http.post<DefaultApiResponse>(`${this.path}/${AccountPathEnum.ACCOUNT}/${AccountPathEnum.RESET}/${AccountPathEnum.SEND_RESET_PASSWORD_EMAIL}`, params);
  }

  validateOtp(email: string, otp: string): Observable<DefaultApiResponse> {
    const params = new HttpParams().set('email', email).set('otp', otp);
    return this.http.post<DefaultApiResponse>(`${this.path}/${AccountPathEnum.ACCOUNT}/${AccountPathEnum.RESET}/${AccountPathEnum.VALIDATE}`, params);
  }

  changePassword(email: string, password: string, otp: string) {
    return this.http.post<DefaultApiResponse>(`${this.path}/${AccountPathEnum.ACCOUNT}/${AccountPathEnum.RESET}/${AccountPathEnum.CHANGE_PASSWORD}`, {
      email,
      password,
      otp
    });
  }

  myAccount(): Observable<IMyAccount> {
    if (!this.cachedAccount$) {
      this.cachedAccount$ = this.http.get<IMyAccount>(`${this.path}/${AccountPathEnum.ACCOUNT}/${AccountPathEnum.MY_ACCOUNT_PATH}`)
      .pipe(
        tap((account: IMyAccount): void => {
          this.account = account;
        }),
        shareReplay(1)
      );
    }
    return this.cachedAccount$;
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.path}/${AccountPathEnum.LOGOUT}`, {})
      .pipe(
        tap(() => {
          this.cachedAccount$ = null;
          this.account = null;
        })
      );
  }

}
