import { Component, effect, inject } from '@angular/core';
import { MessageListComponent } from './ui/message-list.component';
import { MessageService } from '../shared/data-access/message.service';
import { InputMessageComponent } from './ui/message-input.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="container">
      <app-message-list
        [messages]="messageService.messages()"
      ></app-message-list>
      <app-message-input
        (send)="messageService.add$.next($event)"
      ></app-message-input>
    </div>
  `,
  imports: [MessageListComponent, InputMessageComponent],
})
export default class HomeComponent {
  messageService = inject(MessageService);

  constructor() {
    effect(() => {
      console.log('messages', this.messageService.messages());
    });
  }
}
