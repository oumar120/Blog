import { AuthService } from './../service/auth';

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
AuthService = inject(AuthService);
router = inject(Router);
login= signal<string>('');
password= signal<string>('');
message = signal<string>('Vous êtes déconnecté!');
  onSubmit(form:any){
     this.AuthService.login({username: this.login(), password: this.password()}).subscribe({
    next: tokens => {
      this.router.navigate(['/articles']);
    },
    error: err => {
      this.message.set('Échec de la connexion. Veuillez vérifier vos identifiants.');
      this.router.navigate(['/login']);
      console.error('Login failed', err.message);
    }
  });
  }
}
