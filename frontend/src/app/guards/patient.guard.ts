import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { from, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '@services/login/account.service';
import { RolesEnum } from '@enums/roles.enum';

export const PatientGuard: CanActivateFn = (
  // route: ActivatedRouteSnapshot,
  // state: RouterStateSnapshot
) => {

  const accountService: AccountService = inject(AccountService);
  const router: Router = inject(Router);

  return from(accountService.hasAnyRole([RolesEnum.PATIENT])).pipe(
    map((isAuthorized: boolean): boolean => {
      if (isAuthorized) {
        return true;
      } else {
        router.navigate([], {replaceUrl: true});
        return false;
      }
    }),
    catchError((err) => {
      router.navigate([], {replaceUrl: true});
      return throwError(err)
    })
  );
};
