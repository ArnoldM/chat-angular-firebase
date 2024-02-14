import { Component, inject } from '@angular/core';
import { RegisterService } from './data-access/register.service';
import { RegisterFormComponent } from './ui/register-form.component';

@Component({
  standalone: true,
  selector: 'app-register',
  template: `
    <div class="container gradient-bg">
      <app-register-form
        [status]="registerService.status()"
        (register)="registerService.createUser$.next($event)"
      />
    </div>
  `,
  styles: [],
  imports: [RegisterFormComponent],
  providers: [RegisterService],
})
export default class RegisterComponent {
  registerService = inject(RegisterService);
}
