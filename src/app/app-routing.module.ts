import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { LoginComponent } from './Login/login.component';
import { AuthGuard } from './authentication/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      // Define tus rutas de tabs aquí
    ],
  },
  { path: '', redirectTo: '/tabs', pathMatch: 'full' }, // Redirige directamente a la página de tabs por defecto
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
