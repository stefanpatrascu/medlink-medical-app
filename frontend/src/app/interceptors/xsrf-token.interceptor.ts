import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieUtil } from '../utils/cookie.util';
import { AccountPathEnum } from '../enums/account-path.enum';
import { CSRF_COOKIE_NAME } from '../app.constants';

@Injectable()
export class XsrfTokenInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)
      && !this.isUrlExcluded(req.url)) {
      const xsrfToken: string | undefined = CookieUtil.getCookie(CSRF_COOKIE_NAME);
      if (xsrfToken) {
        req = req.clone({
          setHeaders: {
            'X-XSRF-TOKEN': xsrfToken,
          },
        });
      }
    }
    return next.handle(req);
  }

  private isUrlExcluded(url: string): boolean {
    const excludedUrls: string[] = [AccountPathEnum.LOGIN_PATH];
    return excludedUrls.some((excludedUrl) => url.includes(excludedUrl));
  }
}
