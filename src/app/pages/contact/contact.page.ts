import { Component } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage {
  contacts: any[] = [];

  constructor(
    private contactService: ContactService,
    private authService: AuthService
  ) {}

  async ionViewWillEnter() {
    const uid = this.authService.getCurrentUserId();

    if (!uid) {
      console.error('Usuario no autenticado');
      return;
    }

    try {
      this.contacts = await this.contactService.getContactsForUser(uid);
      console.log('Contactos cargados en contact.page:', this.contacts);
    } catch (error) {
      console.error('Error cargando contactos en contact.page:', error);
    }
  }
}
