import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from './features/auth/user-register/user-register.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

const routes: Routes = [
  {
    path: 'auth/register',
    component: UserRegisterComponent
  },
  {path: 'errors/not-found', component: NotFoundComponent},
  {path: 'errors/server-error', component: ServerErrorComponent}
  // ,
  // {path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
