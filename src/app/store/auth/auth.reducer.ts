import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../core/models/auth.model';
import * as AuthActions from './auth.actions';

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    token: response.access_token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
    user: null,
    token: null,
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    token: response.access_token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
    user: null,
    token: null,
  })),

  // Logout
  on(AuthActions.logout, () => ({
    ...initialState,
  })),

  // Set User
  on(AuthActions.setUser, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
  })),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
