import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { from, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RolesEnum } from '@enums/roles.enum';
import { AccountService } from '@services/login/account.service';
import { IMyAccount } from '@interfaces/account/my-account.interface';
import { RoutePathEnum } from '@enums/route-path.enum';

export const AuthenticatedGuard: CanActivateFn = (
  // route: ActivatedRouteSnapshot,
  // state: RouterStateSnapshot
) => {

  const accountService: AccountService = inject(AccountService);
  const router: Router = inject(Router);

  return from(accountService.myAccount()).pipe(
    map((myAccount: IMyAccount): boolean => {
      if (myAccount) {
        const isAdmin = myAccount.roles.indexOf(RolesEnum.ADMIN) > -1;
        const isDoctor = myAccount.roles.indexOf(RolesEnum.DOCTOR) > -1;
        const isFrontDesk = myAccount.roles.indexOf(RolesEnum.FRONT_DESK) > -1;

        if (isAdmin && isDoctor) {
          router.navigate([RoutePathEnum.DASHBOARD], {replaceUrl: true});
        } else if (isAdmin && isFrontDesk) {
          router.navigate([RoutePathEnum.FRONT_DESK_DASHBOARD], {replaceUrl: true});
        } else if (isDoctor) {
          router.navigate([RoutePathEnum.DASHBOARD], {replaceUrl: true});
        } else {
          router.navigate([RoutePathEnum.HOME], {replaceUrl: true});
        }
        return false;
      }
      return true;
    }),
    catchError(() => {
      return of(true); // If there is an error, allow the user to continue
    })
  );
};
