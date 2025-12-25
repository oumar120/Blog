
import { Observable, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthCredentials, GetTokent } from '../model/auth.model';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private isAuth= signal(this.isAuthenticated());
  isAuth$ = this.isAuth.asReadonly();
  currentUser = signal<any>(this.getStoredUser());

  constructor(private httpClient:HttpClient){}

  // Récupérer le user depuis localStorage
  private getStoredUser(): any {
    const stored = localStorage.getItem('current_user');
    return stored ? JSON.parse(stored) : null;
  }

  // Sauvegarder le user dans localStorage
  private storeUser(user: any): void {
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  login(credential:AuthCredentials): Observable<GetTokent>{
   return this.httpClient.post<GetTokent>(`${environment.apiUrl}/token/`, credential).pipe(
    tap(tokens=>{
      // Sauvegarder les tokens D'ABORD
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      this.isAuth.set(true);
      // ENSUITE récupérer l'utilisateur (le token est maintenant disponible)
      this.getUser().subscribe(user => {
        this.storeUser(user);
        console.log(user);
      });
    })
   )
  }
  logOut(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    this.currentUser.set(null);
    this.isAuth.set(false);
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
  refreshToken(): Observable<GetTokent> {
    const refresh = localStorage.getItem('refresh_token') || '';
    return this.httpClient.post<GetTokent>(`${environment.apiUrl}/token/refresh/`, { refresh });
  }
  saveAccessToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.isAuth.set(true);
  }
  getUser():Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.apiUrl}/user/`);
}
}