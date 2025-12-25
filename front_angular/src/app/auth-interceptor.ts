import { ConstantPool } from '@angular/compiler';
import { AuthService } from './service/auth';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const access = localStorage.getItem('access_token');

  // 1) Ajouter le token sur toutes les requêtes « normales »
  if (access) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access}`
      }
    });
  }

  const isAuthUrl = req.url.includes('/token/'); // /token/ ou /token/refresh/

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // 2) Si 401 sur une requête d’auth (login / refresh) → surtout NE PAS refresh encore
      if (error.status === 401 && isAuthUrl) {
        auth.logOut();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      // 3) Si 401 sur une requête normale → essayer UN refresh
      if (error.status === 401 && !isAuthUrl && localStorage.getItem('refresh_token')) {
        return auth.refreshToken().pipe(
          switchMap((newToken: any) => {
            // refresh OK → on sauvegarde le nouveau access
            auth.saveAccessToken(newToken.access);

            // on rejoue la requête originale avec le nouveau token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken.access}`
              }
            });

            return next(retryReq);
          }),
          catchError(err => {
            // 4) Le refresh a aussi échoué (refresh expiré) → déconnexion propre
            auth.logOut();
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }

      // 5) Autres erreurs → on remonte simplement l’erreur
      return throwError(() => error);
    })
  );
};