import { Routes } from '@angular/router';

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
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
  },
  { path: '**', redirectTo: '' },
];
