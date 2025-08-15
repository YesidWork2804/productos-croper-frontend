import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AppState, User } from '../../core/models/auth.model';
import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <mat-toolbar color="primary" class="header">
      <button mat-icon-button (click)="toggleSidenav()" class="menu-button">
        <mat-icon>menu</mat-icon>
      </button>

      <div class="logo" routerLink="/products">
        <mat-icon class="logo-icon">shopping_cart</mat-icon>
        <span class="logo-text">Catálogo</span>
      </div>

      <div class="spacer"></div>

      <div class="user-section" *ngIf="user$ | async as user">
        <span class="welcome-text">Hola, {{ user.nombre }}</span>

        <button
          mat-icon-button
          [matMenuTriggerFor]="userMenu"
          class="user-menu-button"
        >
          <mat-icon>account_circle</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu" xPosition="before">
          <div class="user-info">
            <div class="user-name">{{ user.nombre }}</div>
            <div class="user-email">{{ user.email }}</div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .menu-button {
        margin-right: 16px;
      }

      .logo {
        display: flex;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        transition: opacity 0.2s;
      }

      .logo:hover {
        opacity: 0.8;
      }

      .logo-icon {
        margin-right: 8px;
        font-size: 24px;
      }

      .logo-text {
        font-size: 20px;
        font-weight: 500;
      }

      .spacer {
        flex: 1;
      }

      .user-section {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .welcome-text {
        display: none;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
      }

      .user-menu-button {
        width: 40px;
        height: 40px;
      }

      .user-info {
        padding: 12px 16px;
        border-bottom: 1px solid #e0e0e0;
      }

      .user-name {
        font-weight: 500;
        font-size: 14px;
        color: #333;
      }

      .user-email {
        font-size: 12px;
        color: #666;
        margin-top: 2px;
      }

      @media (min-width: 768px) {
        .welcome-text {
          display: block;
        }

        .menu-button {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .logo-text {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  @Output() sidenavToggle = new EventEmitter<void>();

  user$: Observable<User | null>;

  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(AuthSelectors.selectUser);
  }

  toggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
