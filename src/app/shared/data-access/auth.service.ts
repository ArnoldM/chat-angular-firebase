import { computed, inject, Injectable, signal } from '@angular/core';
import { AUTH } from '../../app.config';
import { authState } from 'rxfire/auth';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { defer, from, map, merge } from 'rxjs';
import { connect } from 'ngxtension/connect';
import { Credentials } from '../interfaces/credentials';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AUTH);

  // source
  private user$ = authState(this.auth);

  // state
  private state = signal<AuthState>({
    user: undefined,
  });

  // selector
  user = computed(() => this.state().user);

  constructor() {
    const nextState$ = merge(this.user$.pipe(map((user) => ({ user }))));

    connect(this.state).with(nextState$);
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password,
        ),
      ),
    );
  }

  logout() {
    signOut(this.auth);
  }

  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password,
        ),
      ),
    );
  }
}
