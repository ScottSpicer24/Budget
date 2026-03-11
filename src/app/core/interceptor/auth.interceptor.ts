// src/app/core/interceptors/auth-token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap } from 'rxjs';
import { env } from '../../../environments/environment';

const SECURE_ROUTES = [env.lambdaURL, 'https://l53q3cn1hh.execute-api.us-east-1.amazonaws.com'];

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const oidcService = inject(OidcSecurityService);

  const isSecureRoute = SECURE_ROUTES.some(route => req.url.startsWith(route));
  if (!isSecureRoute) {
    return next(req);
  }

  return oidcService.getIdToken().pipe(
    switchMap(token => {
      console.log('Auth header that should be sent:', `Bearer ${token}`);

      if (!token) return next(req);
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      console.log(`request sent as : ${JSON.stringify(authReq)}`)
      return next(authReq);
    })
  );
};
