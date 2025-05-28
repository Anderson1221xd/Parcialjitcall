import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { contactService } from '../../core/services/contact.service'; // corregido a mayúscula para convención
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
})
export class AddContactPage {
  uid = '';
  form: FormGroup;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private authService: AuthService,
    private contactService: contactService,
    private loaderService: LoaderService
  ) {
    this.form = this.fb.group({
      nickname: ['', Validators.minLength(3)],
      phone: ['', [Validators.required, Validators.minLength(7)]],
    });

    this.initUser();
  }

  private async initUser() {
    const user = await this.authService.getCurrentUser();
    this.uid = user?.uid || '';
  }

  async save() {
    if (this.form.invalid) {
      return; // o muestra algún error
    }
    await this.loaderService.show('Saving contact...');
    const { phone, nickname } = this.form.value;
    try {
      await this.contactService.addContact(this.uid, phone, nickname);
      this.navCtrl.back();
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      this.loaderService.hide();
    }
  }

  cancelar() {
    this.navCtrl.back();
  }
}
