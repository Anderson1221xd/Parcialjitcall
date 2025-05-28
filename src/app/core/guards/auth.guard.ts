import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);

  async canActivate(): Promise<boolean> {
    const current = await this.auth.getCurrentUser();

    const accessAllowed = current?.emailVerified ?? false;

    if (!accessAllowed) {
      await this.toast.presentToast('Acceso denegado, inicie sesión', 'danger');
      this.router.navigateByUrl('/login');
    }

    return accessAllowed;
  }
}
