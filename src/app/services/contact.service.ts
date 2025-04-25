// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  constructor() {}

  // Método para agregar contacto por número de teléfono
  async addContactByPhone(
    currentUserUid: string,
    phone: string
  ): Promise<boolean> {
    try {
      // Buscar si existe un usuario con ese número
      const usersRef = collection(this.db, 'users');
      const phoneQuery = query(usersRef, where('phone', '==', phone));
      const querySnapshot = await getDocs(phoneQuery);

      if (querySnapshot.empty) {
        return false; // No se encontró el usuario
      }

      // Obtener datos del usuario encontrado
      const userData = querySnapshot.docs[0].data();

      const contactData = {
        name: userData['name'] || '',
        lastname: userData['lastname'] || '',
        phone: userData['phone'],
      };

      // Guardar contacto en la subcolección "contacts" del usuario actual
      const contactRef = doc(
        this.db,
        `users/${currentUserUid}/contacts/${phone}`
      );
      await setDoc(contactRef, contactData, { merge: true });

      return true;
    } catch (error) {
      console.error('Error al agregar contacto:', error);
      throw error;
    }
  }

  // Obtener contactos del usuario actual
  async getContactsForUser(uid: string): Promise<any[]> {
    const contactsRef = collection(this.db, `users/${uid}/contacts`);
    const snapshot = await getDocs(contactsRef);
    return snapshot.docs.map((doc) => doc.data());
  }
}
