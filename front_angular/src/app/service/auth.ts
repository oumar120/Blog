
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
  constructor(private httpClient:HttpClient){}
  currentUser = signal<any>(null);

  login(credential:AuthCredentials): Observable<GetTokent>{
   return this.httpClient.post<GetTokent>(`${environment.apiUrl}/token/`, credential).pipe(
    tap(tokens=>{
      this.getUser().subscribe(user => {
        this.currentUser.set(user)
        console.log(user);
      });
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      this.isAuth.set(true);
    })
   )
  }
  logOut(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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