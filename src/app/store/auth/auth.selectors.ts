import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../core/models/auth.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectUserName = createSelector(
  selectUser,
  (user) => user?.nombre || ''
);

export const selectUserEmail = createSelector(
  selectUser,
  (user) => user?.email || ''
);
