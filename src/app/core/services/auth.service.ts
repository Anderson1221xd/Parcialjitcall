import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  Auth,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly firebaseAuth: Auth) {}

  async createAccount(email: string, password: string): Promise<User> {
    const credentials = await createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );

    if (credentials.user) {
      await sendEmailVerification(credentials.user);
      console.info('Correo de verificación enviado');
    }

    return credentials.user;
  }

  async authenticate(email: string, password: string): Promise<User> {
    const session = await signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );
    return session.user;
  }

  async signOut(): Promise<void> {
    await this.firebaseAuth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const activeUser = this.firebaseAuth.currentUser;

    if (activeUser) {
      return activeUser;
    }

    return new Promise((resolve) => {
      const stop = this.firebaseAuth.onAuthStateChanged((user) => {
        stop();
        resolve(user);
      });
    });
  }

  async sendResetLink(email: string): Promise<void> {
    await sendPasswordResetEmail(this.firebaseAuth, email);
    console.info('Correo para restaurar contraseña enviado');
  }
}
