import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <div class="sidebar">
      <nav class="navigation">
        <mat-nav-list>
          <a mat-list-item routerLink="/products" routerLinkActive="active">
            <mat-icon matListIcon>inventory_2</mat-icon>
            <span matLine>Productos</span>
          </a>

          <a mat-list-item routerLink="/products/new" routerLinkActive="active">
            <mat-icon matListIcon>add_box</mat-icon>
            <span matLine>Nuevo Producto</span>
          </a>

          <mat-divider></mat-divider>

          <div class="section-title">
            <span>Categorías</span>
          </div>

          <a
            mat-list-item
            routerLink="/products"
            [queryParams]="{ categoria: 'Electrónicos' }"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: false }"
          >
            <mat-icon matListIcon>devices</mat-icon>
            <span matLine>Electrónicos</span>
          </a>

          <a
            mat-list-item
            routerLink="/products"
            [queryParams]="{ categoria: 'Computadoras' }"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: false }"
          >
            <mat-icon matListIcon>computer</mat-icon>
            <span matLine>Computadoras</span>
          </a>

          <a
            mat-list-item
            routerLink="/products"
            [queryParams]="{ categoria: 'Accesorios' }"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: false }"
          >
            <mat-icon matListIcon>headphones</mat-icon>
            <span matLine>Accesorios</span>
          </a>
        </mat-nav-list>
      </nav>
    </div>
  `,
  styles: [
    `
      .sidebar {
        width: 100%;
        height: 100%;
        background: #fafafa;
      }

      .navigation {
        padding-top: 16px;
      }

      .section-title {
        padding: 16px 16px 8px 16px;
        font-size: 12px;
        font-weight: 500;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .mat-mdc-nav-list .mat-mdc-list-item.active {
        background-color: rgba(25, 118, 210, 0.08);
        color: #1976d2;
      }

      .mat-mdc-nav-list .mat-mdc-list-item.active .mat-icon {
        color: #1976d2;
      }

      .mat-mdc-nav-list .mat-mdc-list-item {
        transition: background-color 0.2s ease;
      }

      .mat-mdc-nav-list .mat-mdc-list-item:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
    `,
  ],
})
export class SidebarComponent {}
