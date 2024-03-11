import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../../shared/data-access/auth.service';
import { catchError, EMPTY, map, merge, Subject, switchMap } from 'rxjs';
import { Credentials } from '../../../shared/interfaces/credentials';
import { connect } from 'ngxtension/connect';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(AuthService);

  // sources
  error$ = new Subject<any>();
  loginUser$ = new Subject<Credentials>();
  userAuthenticated$ = this.loginUser$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        }),
      ),
    ),
  );

  // state
  private state = signal<LoginState>({
    status: 'pending',
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    const nextState$ = merge(
      this.error$.pipe(map(() => ({ status: 'error' as const }))),
      this.loginUser$.pipe(map(() => ({ status: 'authenticating' as const }))),
      this.userAuthenticated$.pipe(map(() => ({ status: 'success' as const }))),
    );

    connect(this.state).with(nextState$);
  }
}
