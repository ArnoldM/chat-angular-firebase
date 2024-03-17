import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginStatus } from '../data-access/login.service';
import { Credentials } from '../../../shared/interfaces/credentials';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-login-form',
  template: `
    <form
      [formGroup]="loginForm"
      (ngSubmit)="login.emit(this.loginForm.getRawValue())"
      #form="ngForm"
    >
      <mat-form-field appearance="fill">
        <mat-label>email</mat-label>
        <input
          matNativeControl
          formControlName="email"
          type="email"
          placeholder="email"
        />
        <mat-icon matPrefix>email</mat-icon>
      </mat-form-field>
      <mat-form-field>
        <mat-label>password</mat-label>
        <input
          matNativeControl
          formControlName="password"
          data-test="create-password-field"
          type="password"
          placeholder="password"
        />
        <mat-icon matPrefix>lock</mat-icon>
      </mat-form-field>

      @if (loginStatus === 'error') {
        <mat-error>Could not log you in qith those details.</mat-error>
      } @else if (loginStatus === 'authenticating') {
        <mat-spinner diameter="50"></mat-spinner>
      }

      <button
        mat-raised-button
        color="accent"
        type="submit"
        [disabled]="loginStatus === 'authenticating'"
      >
        Submit
      </button>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      button {
        width: 100%;
      }

      mat-error {
        margin: 5px 0;
      }

      mat-spinner {
        margin: 1rem 0;
      }
    `,
  ],
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatPrefix,
    ReactiveFormsModule,
    MatError,
    MatProgressSpinner,
  ],
  providers: [],
})
export class LoginFormComponent {
  @Input({ required: true }) loginStatus!: LoginStatus;
  @Output() login = new EventEmitter<Credentials>();

  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
}
