import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { from, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RolesEnum } from '@enums/roles.enum';
import { AccountService } from '@services/login/account.service';

export const EmployeeGuard: CanActivateFn = (
  // route: ActivatedRouteSnapshot,
  // state: RouterStateSnapshot
) => {

  const accountService: AccountService = inject(AccountService);
  const router: Router = inject(Router);

  return from(accountService.hasAnyRole([RolesEnum.ADMIN, RolesEnum.DOCTOR, RolesEnum.FRONT_DESK])).pipe(
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
