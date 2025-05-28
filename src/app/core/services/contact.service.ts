import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from '@angular/fire/firestore';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import { Contact } from '../../interfaces/contact';
import { UserService } from './user.service';
import { User } from '../../interfaces/user';
import { ToastService } from '../../shared/services/toast.service';
import { ContactDto } from '../../interfaces/contact-dto';

@Injectable({
  providedIn: 'root',
})
export class contactService {
  private contactsStream = new BehaviorSubject<ContactDto[]>([]);
  contacts$ = this.contactsStream.asObservable();

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  private getUserContactsCollection(
    userId: string
  ): CollectionReference<DocumentData> {
    return collection(this.firestore, `users/${userId}/contacts`);
  }

  async addContact(userId: string, phoneNumber: string, alias: string) {
    const foundUser = await this.userService.findByPhone(phoneNumber);

    if (!foundUser) {
      await this.toastService.presentToast('User not found', 'danger');
      return;
    }

    const contactData = { user_uid: foundUser.uid, nickname: alias };
    const contactsCol = this.getUserContactsCollection(userId);

    await addDoc(contactsCol, contactData);
    await this.refreshContacts(userId);
  }

  async refreshContacts(userId: string): Promise<void> {
    const contactsCol = this.getUserContactsCollection(userId);
    const contactsSnapshot = await getDocs(contactsCol);

    const contactList: ContactDto[] = [];

    for (const docSnapshot of contactsSnapshot.docs) {
      const contactUserId = docSnapshot.data()['user_uid'];
      const userDocRef = doc(this.firestore, `users/${contactUserId}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        contactList.push({
          uid: docSnapshot.id,
          user: {
            uid: userDocSnap.id,
            ...userData,
          } as User,
        });
      }
    }

    this.contactsStream.next(contactList);
  }

  getContact(
    userId: string,
    contactDocId: string
  ): Observable<ContactDto | undefined> {
    const contactDocRef = doc(
      this.firestore,
      `users/${userId}/contacts/${contactDocId}`
    );
    return from(this.constructContactDto(contactDocRef));
  }

  private async constructContactDto(
    contactDocRef: any
  ): Promise<ContactDto | undefined> {
    const contactSnapshot = await getDoc(contactDocRef);
    if (!contactSnapshot.exists()) return undefined;

    const contactData = contactSnapshot.data() as { [key: string]: any };
    const linkedUserId = contactData['user_uid'];

    const linkedUserDoc = doc(this.firestore, `users/${linkedUserId}`);
    const linkedUserSnap = await getDoc(linkedUserDoc);

    if (!linkedUserSnap.exists()) return undefined;

    return {
      uid: contactSnapshot.id,
      nickname: contactData['nickname'],
      user: {
        uid: linkedUserSnap.id,
        ...linkedUserSnap.data(),
      } as User,
    };
  }

  async modifyContact(
    userId: string,
    contactDocId: string,
    changes: Partial<Contact>
  ) {
    const contactDocRef = doc(
      this.firestore,
      `users/${userId}/contacts/${contactDocId}`
    );
    await updateDoc(contactDocRef, changes);
    await this.refreshContacts(userId);
  }

  async removeContact(userId: string, contactDocId: string) {
    try {
      const contactDocRef = doc(
        this.firestore,
        `users/${userId}/contacts/${contactDocId}`
      );
      const docSnapshot = await getDoc(contactDocRef);

      if (!docSnapshot.exists()) {
        console.warn('Contact does not exist.');
        return;
      }

      await deleteDoc(contactDocRef);
      console.log('Contact deleted successfully.');
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  }
}
