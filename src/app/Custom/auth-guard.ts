import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { AccessService } from '../Services/Access.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem("token") || "";
  const router = inject(Router);

  const accessService = inject(AccessService)
  if (token != "") {
    return accessService.validateToken(token).pipe(
      map(data => {
        if (data.isSuccess) {
          return true
        } else {
          router.navigate([""])
          return false;
        }
      }),
      catchError(error => {
        router.navigate([""])
        return of(false);
      })
    )
  }
  else {
    //const url = router.createUrlTree([""])
    router.navigateByUrl("");
    return false;
  }
};
