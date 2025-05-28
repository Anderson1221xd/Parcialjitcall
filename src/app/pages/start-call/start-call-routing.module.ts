import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartCallPage } from './start-call.page';

const routes: Routes = [
  {
    path: '',
    component: StartCallPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomingCallPageRoutingModule {}
