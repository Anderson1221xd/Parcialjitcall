import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPage } from './register.page';
import { LoginBlockGuard } from '../../core/guards/sesion-block.guard';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage,
    canActivate: [LoginBlockGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}
