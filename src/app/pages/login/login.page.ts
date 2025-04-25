import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service'; // 👈 IMPORTANTE

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService // 👈 INYECTA EL SERVICIO
  ) {}

  async login() {
    try {
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        // 🔔 Inicia la configuración de notificaciones
        this.notificationsService.initPush(); // 👈 AQUÍ
        this.router.navigate(['/dashboard']); // Redirección
      }
    } catch (error) {
      console.error('Error al iniciar sesión: ', error);
    }
  }
}
