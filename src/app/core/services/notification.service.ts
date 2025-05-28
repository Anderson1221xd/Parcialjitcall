import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseApiUrl = environment.notifications;
  private notificationsEndpoint = `${this.baseApiUrl}notifications`;
  private loginEndpoint = `${this.baseApiUrl}user/login`;

  constructor(private http: HttpClient, private userService: UserService) {}

  async initialize() {
    const { email, password } = environment.notificationUser;

    this.http.post<any>(this.loginEndpoint, { email, password }).subscribe({
      next: (response) => {
        const accessToken = response?.data?.access_token;
        console.log('Access Token:', accessToken);
        if (accessToken) {
          localStorage.setItem('token', accessToken);
        }
        console.log('Login response:', response);
      },
      error: (err) => {
        console.error('Login error:', err);
      },
    });
  }

  async sendNotification(
    eventType: 'incoming_call' | 'message',
    payloadData: {
      meetingId?: string;
      userSend: { uid: string; name: string };
      userReceiver: { uid: string; name: string; token?: string };
    }
  ) {
    const { userSend, userReceiver, meetingId } = payloadData;
    const deviceToken = userReceiver.token;
    const androidPriority = 'high';

    const notificationTitles = {
      incoming_call: 'Incoming call...',
      message: 'New message received',
    };

    const notificationBodies = {
      incoming_call: `${userSend.name} is calling you`,
      message: `${userSend.name}: Sent you a message`,
    };

    const notificationPayload = {
      token: deviceToken,
      notification: {
        title: notificationTitles[eventType],
        body: notificationBodies[eventType],
      },
      android: {
        priority: androidPriority,
        data: {
          type: eventType,
          userId: userSend.uid,
          name: userSend.name,
          userFrom: userReceiver.uid,
          meetingId: meetingId ?? 'no_meeting',
        },
      },
    };

    console.log('Notification Payload:', JSON.stringify(notificationPayload));

    try {
      console.log('🚀 Sending notification...');
      await firstValueFrom(
        this.http.post(this.notificationsEndpoint, notificationPayload)
      );
      console.log('✅ Notification sent successfully.');
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
    }
  }
}
