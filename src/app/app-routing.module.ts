import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'contact/:id',
    loadChildren: () =>
      import('./pages/contact/contact.module').then((m) => m.ContactPageModule),
  },
  {
    path: 'start-call',
    loadChildren: () =>
      import('./pages/start-call/start-call.module').then(
        (m) => m.StartCallPageModule
      ),
  },

  {
    path: 'add-contact',
    loadChildren: () =>
      import('./pages/add-contact/add-contact.module').then(
        (m) => m.AddContactPageModule
      ),
  },
  {
    path: 'edit-contact/:id',
    loadChildren: () =>
      import('./pages/edit-contact/edit-contact.module').then(
        (m) => m.EditContactPageModule
      ),
  },

  {
    path: 'chat/:id',
    loadChildren: () =>
      import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
