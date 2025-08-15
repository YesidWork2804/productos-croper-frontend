import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import * as AuthActions from '../../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';
import { AppState } from '../../../../core/models/api.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>shopping_cart</mat-icon>
            Catálogo de Productos
          </mat-card-title>
          <mat-card-subtitle>Iniciar Sesión</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                autocomplete="email"
              />
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Ingresa un email válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                autocomplete="current-password"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword = !hidePassword"
              >
                <mat-icon>{{
                  hidePassword ? 'visibility' : 'visibility_off'
                }}</mat-icon>
              </button>
              <mat-error
                *ngIf="loginForm.get('password')?.hasError('required')"
              >
                La contraseña es requerida
              </mat-error>
              <mat-error
                *ngIf="loginForm.get('password')?.hasError('minlength')"
              >
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="loginForm.invalid || (loading$ | async)"
                class="full-width"
              >
                <mat-spinner
                  diameter="20"
                  *ngIf="loading$ | async"
                ></mat-spinner>
                <span *ngIf="!(loading$ | async)">Iniciar Sesión</span>
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions align="start">
          <p>
            ¿No tienes cuenta?
            <a routerLink="/auth/register" mat-button color="primary"
              >Regístrate</a
            >
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .login-card {
        width: 100%;
        max-width: 400px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .demo-card {
        width: 100%;
        max-width: 400px;
        padding: 15px;
      }

      .full-width {
        width: 100%;
        margin-bottom: 15px;
      }

      .form-actions {
        margin-top: 20px;
      }

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      mat-spinner {
        margin-right: 10px;
      }

      @media (max-width: 480px) {
        .login-container {
          padding: 10px;
        }
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  loading$: Observable<boolean>;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(
        AuthActions.login({
          credentials: this.loginForm.value,
        })
      );
    }
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@test.com',
      password: 'password123',
    });
  }
}
