import { Injectable } from '@angular/core';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

const CustomPlugin = registerPlugin<{
  addListener: (
    event: string,
    callback: (payload: any) => void
  ) => Promise<void>;
  resumePending: () => Promise<void>;
}>('MyCustomPlugin');

@Injectable({
  providedIn: 'root',
})
export class PushService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private navController: NavController
  ) {}

  async updateFcmToken() {
    console.log('🔄 Starting FCM token refresh...');
    if (Capacitor.getPlatform() === 'web') {
      console.warn('⚠️ Push notifications are not supported on web platform.');
      return;
    }

    await this.ensurePermission();
    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      console.log('✅ FCM token received:', token.value);
      const currentUser = this.auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(this.firestore, `users/${currentUser.uid}`);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as any;
          if (userData.token !== token.value) {
            await updateDoc(userDocRef, { token: token.value });
            console.log('📌 Token updated successfully in Firestore.');
          } else {
            console.log('ℹ️ Token has not changed; no update required.');
          }
        }
      } else {
        localStorage.setItem('fcmToken', token.value);
        console.log('👤 User not authenticated, token stored locally.');
      }
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('❌ FCM registration error:', error);
    });
  }

  async startNotificationListener() {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('⚠️ Push notifications are not supported on web platform.');
      return;
    }

    await CustomPlugin.addListener('pushNotificationReceived', (payload) => {
      this.navigateToCallScreen(payload.meetingId, payload.callerName);
    });

    LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (event) => {
        console.log('➡️ Local notification action triggered:', event);
        const meetingId = event.notification?.extra?.meetingId;
        const callerName = event.notification?.extra?.callerName;
        if (meetingId && callerName) {
          console.log('📲 Redirecting to incoming call screen...');
          this.navigateToCallScreen(meetingId, callerName);
        }
      }
    );
  }

  private async ensurePermission() {
    const permissionStatus = await PushNotifications.checkPermissions();
    if (permissionStatus.receive !== 'granted') {
      await PushNotifications.requestPermissions();
    }
  }

  async navigateToCallScreen(meetingId: string, callerName: string) {
    await this.navController.navigateForward(['/incoming-call'], {
      state: { meetingId, callerName },
    });
  }
}
