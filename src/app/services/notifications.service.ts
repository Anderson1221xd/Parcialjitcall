import { Injectable } from '@angular/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  async initPush() {
    if (Capacitor.getPlatform() === 'web') {
      console.log('⚠️ Push notifications no disponibles en web.');
      return;
    }

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive !== 'granted') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === 'granted') {
      PushNotifications.register();
    }

    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('✅ FCM Token:', token.value);

      this.auth.authState.subscribe(async (user) => {
        if (user) {
          console.log('🔐 UID del usuario:', user.uid);
          const ref = this.firestore.collection('users').doc(user.uid);
          await ref.set({ token: token.value }, { merge: true });
          console.log('✅ Token guardado en Firestore');
        } else {
          console.warn('⚠️ Usuario no autenticado. Token no guardado');
        }
      });
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('❌ Error en registro de push notifications: ', err);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('🔔 Notificación recibida:', notification);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('📲 Acción sobre notificación:', action);
      }
    );
  }
}
