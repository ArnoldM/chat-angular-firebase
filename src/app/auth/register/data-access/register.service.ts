import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, map, merge, Subject, switchMap } from 'rxjs';
import { Credentials } from '../../../shared/interfaces/credentials';
import { AuthService } from '../../../shared/data-access/auth.service';
import { connect } from 'ngxtension/connect';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

@Injectable()
export class RegisterService {
  private authService = inject(AuthService);

  // source
  error$ = new Subject<any>();
  createUser$ = new Subject<Credentials>();
  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        }),
      ),
    ),
  );

  // state
  private state = signal<RegisterState>({
    status: 'pending',
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    const nextState$ = merge(
      this.userCreated$.pipe(map(() => ({ status: 'success' as const }))),
      this.createUser$.pipe(map(() => ({ status: 'creating' as const }))),
      this.error$.pipe(map(() => ({ status: 'error' as const }))),
    );

    connect(this.state).with(nextState$);
  }
}
