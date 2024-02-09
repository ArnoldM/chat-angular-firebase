import { computed, inject, Injectable, signal } from '@angular/core';
import { query, collection, orderBy, limit } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { connect } from 'ngxtension/connect';

import { map, merge, Observable } from 'rxjs';

import { FIRESTORE } from '../../app.config';
import { Message } from '../interfaces/messages';

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(FIRESTORE);

  // source
  message$ = this.getMessages();

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
      this.message$.pipe(
        map((messages) => {
          console.log('messages from service', messages);
          return { messages };
        }),
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
}
