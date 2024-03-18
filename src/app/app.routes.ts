import { Routes } from '@angular/router';
import { isAuthenticated } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [isAuthenticated],
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
