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
  { path: '**', redirectTo: '' },
];
