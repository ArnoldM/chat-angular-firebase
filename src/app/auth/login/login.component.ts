import { Component, effect, inject } from '@angular/core';
import { LoginFormComponent } from './ui/login-form.component';
import { LoginService } from './data-access/login.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/data-access/auth.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <div class="container gradient-bg">
      @if (authService.user() === null) {
        <app-login-form
          [loginStatus]="loginService.status()"
          (login)="loginService.loginUser$.next($event)"
        ></app-login-form>
        <a routerLink="/auth/register">Create account</a>
      } @else {
        <mat-spinner diameter="50" />
      }
    </div>
  `,
  styles: [
    `
      a {
        margin: 2rem;
        color: var(--accent-darker-color);
      }
    `,
  ],
  imports: [LoginFormComponent, RouterLink, MatProgressSpinner],
  providers: [LoginService],
})
export default class LoginComponent {
  loginService = inject(LoginService);
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['home']);
      }
    });
  }
}
