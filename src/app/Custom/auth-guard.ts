import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccessService } from '../Services/Access.service';
import { catchError, map, of } from 'rxjs';
import { LocalStorageService } from '../Services/LocalStorage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem("token") || "";
  const router = inject(Router);
  const accessService = inject(AccessService)
  if (token != "") {
    return accessService.validateToken(token).pipe(
      map(data => {
        if (data.value) {
          return true
        } else {
          return router.createUrlTree(['login']);
        }
      }),
      catchError(error => {
        return of(router.createUrlTree(['login']));
      })
    )
  }
  else {
    return router.createUrlTree(['login']);
  }
};
