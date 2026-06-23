import { Routes } from '@angular/router';
import { lectorGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'burritolector/login', pathMatch: 'full' },

  {
    path: 'burritolector/login',
    loadComponent: () => import('./pages/lector/login/login').then((m) => m.Login),
  },
  {
    path: 'burritolector/registro',
    loadComponent: () => import('./pages/lector/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'burritolector/galeria',
    canActivate: [lectorGuard],
    loadComponent: () => import('./pages/lector/galeria/galeria').then((m) => m.Galeria),
  },
  {
    path: 'burritolector/libro/:id',
    canActivate: [lectorGuard],
    loadComponent: () =>
      import('./pages/lector/detalle-libro/detalle-libro').then((m) => m.DetalleLibro),
  },
  {
    path: 'burritolector/dashboard',
    canActivate: [lectorGuard],
    loadComponent: () =>
      import('./pages/lector/dashboard-usuario/dashboard-usuario').then((m) => m.DashboardUsuario),
  },
  {
    path: 'burritolector/afinidad',
    canActivate: [lectorGuard],
    loadComponent: () => import('./pages/lector/afinidad/afinidad').then((m) => m.Afinidad),
  },

  {
    path: 'burritoadministrador/login',
    loadComponent: () => import('./pages/admin/login/login').then((m) => m.AdminLogin),
  },
  {
    path: 'burritoadministrador/dash',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'burritoadministrador/libros',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/libros/libros').then((m) => m.LibrosAdmin),
  },

  { path: '**', redirectTo: 'burritolector/login' },
];
