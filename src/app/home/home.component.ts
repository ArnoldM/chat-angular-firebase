import { Component, effect, inject } from '@angular/core';
import { MessageListComponent } from './ui/message-list.component';
import { MessageService } from '../shared/data-access/message.service';
import { InputMessageComponent } from './ui/message-input.component';
import { AuthService } from '../shared/data-access/auth.service';
import { Router } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="container">
      <mat-toolbar color="primary">
        <span class="spacer"></span>
        <button mat-icon-button (click)="authService.logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <app-message-list
        [messages]="messageService.messages()"
        [activeUSer]="authService.user()"
      ></app-message-list>
      <app-message-input
        (send)="messageService.add$.next($event)"
      ></app-message-input>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
      }

      mat-toolbar {
        z-index: 10;
        box-shadow: 0px -7px 11px 0px var(--accent-color);
      }

      app-message-list {
        overflow: hidden;
        width: 100%;
      }

      app-message-input {
      }
    `,
  ],
  imports: [
    MessageListComponent,
    InputMessageComponent,
    MatToolbar,
    MatIconButton,
    MatIcon,
  ],
})
export default class HomeComponent {
  messageService = inject(MessageService);
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });
  }
}
