import { CanActivateFn, Router } from '@angular/router';

import { AccessService } from '../Services/Access.service';
import { catchError, map, of } from 'rxjs';
import { LocalStorageService } from '../Services/local-storage';
import { inject } from '@angular/core';
import { SecurityService } from '../Services/security.service';
import { NotifierService } from '../notifier.service';

export const routeGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const usuarioId = localStorageService.getItem("UsuarioId") || "";
  const empresaId = localStorageService.getItem("EmpresaId") || "";
  const router = inject(Router);
  const securityService = inject(SecurityService)
  const path = state.url.startsWith('/') ? state.url.slice(1) : state.url;
  const notifierService = inject(NotifierService);

  console.log(path)
  if (usuarioId != "" && empresaId != "" && path != null) {
    return securityService.ValudateUrl(path, usuarioId, empresaId).pipe(
      map(data => {
        if (data.value) {
          return true
        } else {
          notifierService.showNotification(data.msg, 'Error', 'error');
          return router.createUrlTree(['security']);
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
