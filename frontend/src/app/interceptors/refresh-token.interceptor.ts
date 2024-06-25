import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AccountService } from '../services/login/account.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  ignoredEndpoints: string[] = ['/register', '/login', '/account/reset', '/refresh', '/logout'];

  constructor(private accountService: AccountService,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    if (this.ignoredEndpoints.some((endpoint: string) => request.url.includes(endpoint))) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          return this.accountService.refreshToken().pipe(
            switchMap(() => {
              return next.handle(request);
            }),
            catchError((refreshError) => {
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
