import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductsEffects } from './store/products/products.effects';
import { AuthEffects } from './store/auth/auth.effects';
import { authReducer } from './store/auth/auth.reducer';
import { productsReducer } from './store/products/products.reducer';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),

    provideStore({
      auth: authReducer,
      products: productsReducer,
    }),
    provideEffects([AuthEffects, ProductsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),

    importProvidersFrom(MatSnackBarModule),
  ],
};
