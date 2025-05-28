import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { UserService } from './user.service';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  constructor(
    private navController: NavController,
    private userSvc: UserService,
    private toast: ToastService,
    private auth: AuthService,
    private notifySvc: NotificationService
  ) {}

  async acceptIncomingCall(meetingId: string, callerName: string) {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('Función disponible solo en Android.');
      return;
    }

    try {
      await (window as any).Capacitor.Plugins.MyCustomPlugin.startCall({
        meetingId,
        userName: callerName,
      });
    } catch (err) {
      console.error('❌ Error al iniciar llamada:', err);
    }
  }

  async initiateCallByPhone(phoneNumber: string) {
    const receiver = await this.userSvc.findByPhone(phoneNumber);
    const currentUser = await this.auth.getCurrentUser();
    if (!currentUser?.uid) {
      // Maneja el caso de uid indefinido, por ejemplo lanzar error o retornar null
      throw new Error('UID no definido');
    }

    const sender = await this.userSvc.fetchUserById(currentUser.uid);

    if (!sender || !receiver) {
      await this.toast.presentToast('No se pudo iniciar la llamada', 'danger');
      return;
    }

    const meetingId = this.createRandomId();

    this.startCall(meetingId, sender.name).then(() => {
      this.notifySvc.sendNotification('incoming_call', {
        meetingId,
        userSend: {
          uid: sender.uid,
          name: sender.name,
        },
        userReceiver: {
          uid: receiver.uid,
          name: receiver.name,
          token: receiver.token,
        },
      });
    });
  }

  private createRandomId(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+-=|;:,.';
    return Array.from({ length: 10 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }

  async startCall(meetingId: string, userName?: string | null) {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('Función disponible solo en Android.');
      return;
    }

    try {
      await (window as any).Capacitor.Plugins.MyCustomPlugin.startCall({
        meetingId,
        userName,
      });
    } catch (err) {
      console.error('❌ Error al iniciar llamada:', err);
    }
  }

  async cancelCall() {
    await this.navController.navigateRoot('/home');
  }
}
