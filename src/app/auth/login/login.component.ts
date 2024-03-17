import { Component, inject } from '@angular/core';
import { LoginFormComponent } from './ui/login-form.component';
import { LoginService } from './data-access/login.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <div class="container gradient-bg">
      <app-login-form
        [loginStatus]="loginService.status()"
        (login)="loginService.loginUser$.next($event)"
      ></app-login-form>
      <a routerLink="/auth/register">Create account</a>
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
  imports: [LoginFormComponent, RouterLink],
  providers: [LoginService],
})
export default class LoginComponent {
  loginService = inject(LoginService);
}
