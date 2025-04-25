import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  contacts: any[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private contactService: ContactService
  ) {}

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
  async ngOnInit() {
    const uid = this.authService.getCurrentUserId();

    if (!uid) {
      console.error('Usuario no autenticado');
      return;
    }

    try {
      this.contacts = await this.contactService.getContactsForUser(uid);
      console.log('Contactos recuperados:', this.contacts);
    } catch (error) {
      console.error('Error al cargar contactos:', error);
    }
  }
}
