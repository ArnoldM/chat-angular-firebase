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
      ></app-message-list>
      <app-message-input
        (send)="messageService.add$.next($event)"
      ></app-message-input>
    </div>
  `,
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
