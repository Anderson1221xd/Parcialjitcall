import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomingCallPageRoutingModule } from './start-call-routing.module';

import { StartCallPage } from './start-call.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule, IncomingCallPageRoutingModule],
  declarations: [StartCallPage],
})
export class StartCallPageModule {}
