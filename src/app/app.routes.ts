import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/products/components/product-list/product-list.component'
              ).then((m) => m.ProductListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                './features/products/components/product-form/product-form.component'
              ).then((m) => m.ProductFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './features/products/components/product-detail/product-detail.component'
              ).then((m) => m.ProductDetailComponent),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import(
                './features/products/components/product-form/product-form.component'
              ).then((m) => m.ProductFormComponent),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/products',
  },
];
