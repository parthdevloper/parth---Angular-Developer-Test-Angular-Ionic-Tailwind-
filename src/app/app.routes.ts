import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: '',
    loadChildren: () => import('./layout/tabs/tabs.routes').then((m) => m.tabsRoutes),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
