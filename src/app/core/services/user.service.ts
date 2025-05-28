import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly db = inject(Firestore);
  async create(user: User): Promise<void> {
    const userDocRef = doc(this.db, 'users', user.uid);
    await setDoc(userDocRef, user);
  }

  async get(uid: string | undefined): Promise<User | undefined> {
    if (!uid) return undefined;
    return this.fetchUserById(uid);
  }

  async fetchUserById(uid: string): Promise<User | undefined> {
    const userDocRef = doc(this.db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists() ? (docSnap.data() as User) : undefined;
  }

  async modifyUser(
    uid: string,
    updates: Partial<Omit<User, 'uid' | 'email'>>
  ): Promise<void> {
    const userDocRef = doc(this.db, 'users', uid);
    await updateDoc(userDocRef, updates);
  }

  async removeUser(uid: string): Promise<void> {
    const userDocRef = doc(this.db, 'users', uid);
    await deleteDoc(userDocRef);
  }

  async listUsers(): Promise<User[]> {
    const usersCol = collection(this.db, 'users');
    const querySnapshot = await getDocs(usersCol);
    return querySnapshot.docs.map((doc) => doc.data() as User);
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    const usersCol = collection(this.db, 'users');
    const phoneQuery = query(
      usersCol,
      where('phone', '==', Number(phoneNumber))
    );
    const results = await getDocs(phoneQuery);

    if (!results.empty) {
      const firstDoc = results.docs[0];
      return { uid: firstDoc.id, ...firstDoc.data() } as User;
    }
    return null;
  }

  async updateUserToken(user: { uid: string }, token: string): Promise<void> {
    const userDocRef = doc(this.db, `users/${user.uid}`);
    await updateDoc(userDocRef, { token });
  }
}
