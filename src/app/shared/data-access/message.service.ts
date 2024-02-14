import { computed, inject, Injectable, signal } from '@angular/core';
import { query, collection, orderBy, limit, addDoc } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { connect } from 'ngxtension/connect';

import {
  catchError,
  defer,
  exhaustMap,
  ignoreElements,
  map,
  merge,
  Observable,
  of,
  Subject,
} from 'rxjs';

import { FIRESTORE } from '../../app.config';
import { Message } from '../interfaces/messages';
import { AuthService } from './auth.service';

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);

  // source
  message$ = this.getMessages();
  add$ = new Subject<Message['content']>();

  // state
  private state = signal<MessageState>({
    messages: [],
    error: null,
  });

  // selectors
  messages = computed(() => this.state().messages);
  error = computed(() => this.state().error);

  constructor() {
    // reducers
    const nextState$ = merge(
      this.message$.pipe(map((messages) => ({ messages }))),
      this.add$.pipe(
        exhaustMap((message) => this.addMessage(message)),
        ignoreElements(),
        catchError((error) => of({ error })),
      ),
    );

    connect(this.state).with(nextState$);
  }

  private getMessages() {
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
      orderBy('created', 'desc'),
      limit(50),
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      map((messages) => [...messages].reverse()),
    ) as Observable<Message[]>;
  }

  private addMessage(message: string) {
    const newMessage: Message = {
      author: this.authService.user()!.email!,
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => addDoc(messagesCollection, newMessage));
  }
}
