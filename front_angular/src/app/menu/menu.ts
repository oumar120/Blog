import { NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth';

@Component({
  selector: 'app-menu',
  imports: [NgIf,RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu  {
authService = inject(AuthService)
router = inject(Router);
isAuthenticated = this.authService.isAuth$;
logOut(){
  this.authService.logOut();
  this.router.navigate(['/articles']);
}
}
