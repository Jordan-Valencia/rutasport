import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./home/catalog/catalog.component').then(m => m.CatalogComponent),
  },
  {
    path: 'producto/:id',
    loadComponent: () => import('./home/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
  },
  {
    path: 'terminos',
    loadComponent: () => import('./terminos/terminos.component').then(m => m.TerminosComponent),
  },
  {
    path: 'pago/exitoso',
    loadComponent: () => import('./pago/exitoso/exitoso.component').then(m => m.PagoExitosoComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'recuperar/:token',
    loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
