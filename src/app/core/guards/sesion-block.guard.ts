import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoginBlockGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(ToastService);
  private readonly nav = inject(Router);

  async canActivate(): Promise<boolean> {
    const session = await this.auth.getCurrentUser();

    const isLoggedIn = session?.emailVerified ?? false;

    if (isLoggedIn) {
      this.notify.presentToast('No puedes acceder a esta sección', 'danger');
      this.nav.navigate(['/home']);
    }

    return !isLoggedIn;
  }
}
