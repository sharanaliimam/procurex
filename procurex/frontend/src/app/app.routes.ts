import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/signup/signup.component').then((m) => m.SignupComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tenders',
    loadComponent: () => import('./features/tenders/tenders.component').then((m) => m.TendersComponent),
    canActivate: [authGuard],
    data: { roles: ['admin', 'vendor'] }
  },
  {
    path: 'vendors',
    loadComponent: () => import('./features/vendors/vendors.component').then((m) => m.VendorsComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'bids',
    loadComponent: () => import('./features/bids/bids.component').then((m) => m.BidsComponent),
    canActivate: [authGuard],
    data: { roles: ['admin', 'vendor'] }
  },
  {
    path: 'evaluations',
    loadComponent: () => import('./features/evaluations/evaluations.component').then((m) => m.EvaluationsComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'documents',
    loadComponent: () => import('./features/documents/documents.component').then((m) => m.DocumentsComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/notifications/notifications.component').then((m) => m.NotificationsComponent),
    canActivate: [authGuard],
    data: { roles: ['admin', 'vendor'] }
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  { path: '**', redirectTo: 'login' }
];
