import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../Services/local-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);

  if (req.url.indexOf("Login") > 0) return next(req);

  const token = localStorageService.getItem("token");
  
  const clonRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })

  return next(clonRequest);
};
