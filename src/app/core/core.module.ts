import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from 'src/environments/environment';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './services/user.service';
import { contactService } from './services/contact.service';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { CallService } from './services/call.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    UserService,
    contactService,
    AuthService,
    NotificationService,
    CallService,
  ],
})
export class CoreModule {}
