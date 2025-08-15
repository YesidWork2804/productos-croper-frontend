import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
  ],
  template: `
    <mat-card class="product-card" [class.card-hover]="true">
      <mat-card-header>
        <div mat-card-avatar class="product-avatar">
          <mat-icon>inventory_2</mat-icon>
        </div>
        <mat-card-title class="product-title">{{
          product.nombre
        }}</mat-card-title>
        <mat-card-subtitle>{{ product.categoria }}</mat-card-subtitle>

        <div class="card-actions">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onEdit()">
              <mat-icon>edit</mat-icon>
              <span>Editar</span>
            </button>
            <button mat-menu-item (click)="onDelete()" class="delete-option">
              <mat-icon>delete</mat-icon>
              <span>Eliminar</span>
            </button>
          </mat-menu>
        </div>
      </mat-card-header>

      <mat-card-content class="product-content">
        <div class="price-section">
          <span class="price">{{
            product.precio | currency : 'USD' : 'symbol' : '1.2-2'
          }}</span>
        </div>

        <p class="description" *ngIf="product.descripcion">
          {{ product.descripcion }}
        </p>

        <div class="product-meta">
          <mat-chip class="category-chip">
            <mat-icon matChipIcon>category</mat-icon>
            {{ product.categoria }}
          </mat-chip>
        </div>
      </mat-card-content>

      <mat-card-actions class="card-footer">
        <button
          mat-button
          color="primary"
          [routerLink]="['/products', product._id]"
        >
          <mat-icon>visibility</mat-icon>
          Ver detalles
        </button>

        <button mat-stroked-button color="primary" (click)="onEdit()">
          <mat-icon>edit</mat-icon>
          Editar
        </button>
      </mat-card-actions>

      <div class="creation-date" *ngIf="product.createdAt">
        <small>Creado: {{ product.createdAt | date : 'short' }}</small>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .product-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .card-hover:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .product-avatar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .product-title {
        font-size: 18px !important;
        font-weight: 500 !important;
        line-height: 1.3 !important;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .card-actions {
        margin-left: auto;
      }

      .product-content {
        flex: 1;
        padding: 16px !important;
      }

      .price-section {
        margin-bottom: 12px;
      }

      .price {
        font-size: 24px;
        font-weight: 600;
        color: #2e7d32;
        background: linear-gradient(90deg, #2e7d32, #4caf50);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .description {
        margin: 12px 0;
        color: #666;
        font-size: 14px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .product-meta {
        margin-top: 16px;
      }

      .category-chip {
        background-color: #e3f2fd;
        color: #1976d2;
        font-size: 12px;
      }

      .card-footer {
        padding: 8px 16px 16px !important;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .card-footer button {
        flex: 1;
        min-width: 120px;
      }

      .creation-date {
        position: absolute;
        bottom: 4px;
        right: 8px;
        color: #999;
        font-size: 11px;
        margin-top: 4px;
      }

      .delete-option {
        color: #d32f2f;
      }

      .delete-option mat-icon {
        color: #d32f2f;
      }

      @media (max-width: 480px) {
        .product-title {
          font-size: 16px !important;
          max-width: 150px;
        }

        .price {
          font-size: 20px;
        }

        .card-footer {
          flex-direction: column;
        }

        .card-footer button {
          width: 100%;
        }
      }
    `,
  ],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  onEdit(): void {
    this.edit.emit(this.product);
  }

  onDelete(): void {
    this.delete.emit(this.product);
  }
}
