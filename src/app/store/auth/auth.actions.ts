import { createAction, props } from '@ngrx/store';
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  User,
} from '../../core/models/auth.model';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginDto }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: AuthResponse }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);
export const register = createAction(
  '[Auth] Register',
  props<{ userData: RegisterDto }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ response: AuthResponse }>()
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);
export const logout = createAction('[Auth] Logout');
export const initializeAuth = createAction('[Auth] Initialize');
export const setUser = createAction(
  '[Auth] Set User',
  props<{ user: User; token: string }>()
);
export const clearError = createAction('[Auth] Clear Error');
