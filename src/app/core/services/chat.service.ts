import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  orderBy,
  collectionData,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from 'src/app/interfaces/message';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private firestore: Firestore,
    private notificationService: NotificationService
  ) {}

  private generateConversationId(uidA: string, uidB: string): string {
    return [uidA, uidB].sort().join('_');
  }

  async getOrCreateConversation(uidA: string, uidB: string): Promise<string> {
    const conversationId = this.generateConversationId(uidA, uidB);
    const conversationDoc = doc(this.firestore, `chats/${conversationId}`);
    const docSnapshot = await getDoc(conversationDoc);

    if (!docSnapshot.exists()) {
      await setDoc(conversationDoc, {
        users: [uidA, uidB],
        lastMessage: '',
        updatedAt: serverTimestamp(),
      });
    }

    return conversationId;
  }

  watchMessages(conversationId: string): Observable<Message[]> {
    const messagesCollection = collection(
      this.firestore,
      `chats/${conversationId}/messages`
    );
    const messagesQuery = query(
      messagesCollection,
      orderBy('timestamp', 'asc')
    );
    return collectionData(messagesQuery, { idField: 'id' }) as Observable<
      Message[]
    >;
  }

  async postMessage(conversationId: string, message: Message): Promise<void> {
    const messagesCollection = collection(
      this.firestore,
      `chats/${conversationId}/messages`
    );
    await addDoc(messagesCollection, {
      ...message,
      timestamp: serverTimestamp(),
    });

    const conversationDoc = doc(this.firestore, `chats/${conversationId}`);
    await setDoc(
      conversationDoc,
      {
        lastMessage: message.type === 'text' ? message.content : message.type,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
