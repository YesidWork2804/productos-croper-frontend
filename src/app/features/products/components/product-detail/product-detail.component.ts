import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { AppState } from '../../../../core/models/product.model';
import { Product } from '../../../../core/models/product.model';
import * as ProductsActions from '../../../../store/products/products.actions';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as ProductsSelectors from '../../../../store/products/products.selectors';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  template: `
    <div class="detail-container">
      <!-- Loading -->
      <div class="loading-container" *ngIf="loading$ | async">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Cargando producto...</p>
      </div>

      <!-- Product Detail -->
      <div *ngIf="product$ | async as product" class="product-detail">
        <!-- Header -->
        <div class="detail-header">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="page-title">Detalles del Producto</h1>
          <div class="header-actions">
            <button
              mat-stroked-button
              color="primary"
              [routerLink]="['/products', product._id, 'edit']"
            >
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button
              mat-stroked-button
              color="warn"
              (click)="deleteProduct(product)"
            >
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </div>
        </div>

        <!-- Product Card -->
        <mat-card class="product-card">
          <mat-card-header class="product-header">
            <div mat-card-avatar class="product-avatar">
              <mat-icon>inventory_2</mat-icon>
            </div>
            <mat-card-title class="product-title">{{
              product.nombre
            }}</mat-card-title>
            <mat-card-subtitle>{{ product.categoria }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content class="product-content">
            <!-- Price -->
            <div class="price-section">
              <span class="price-label">Precio:</span>
              <span class="price">{{
                product.precio | currency : 'USD' : 'symbol' : '1.2-2'
              }}</span>
            </div>

            <!-- Description -->
            <div class="description-section" *ngIf="product.descripcion">
              <h3>Descripción</h3>
              <p>{{ product.descripcion }}</p>
            </div>

            <!-- Category -->
            <div class="category-section">
              <h3>Categoría</h3>
              <mat-chip class="category-chip">
                <mat-icon matChipIcon>category</mat-icon>
                {{ product.categoria }}
              </mat-chip>
            </div>

            <!-- Metadata -->
            <div class="metadata-section">
              <h3>Información adicional</h3>
              <div class="metadata-grid">
                <div class="metadata-item">
                  <strong>ID:</strong>
                  <span>{{ product._id }}</span>
                </div>
                <div class="metadata-item" *ngIf="product.createdAt">
                  <strong>Fecha de creación:</strong>
                  <span>{{ product.createdAt | date : 'medium' }}</span>
                </div>
                <div class="metadata-item" *ngIf="product.updatedAt">
                  <strong>Última actualización:</strong>
                  <span>{{ product.updatedAt | date : 'medium' }}</span>
                </div>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions class="card-actions">
            <button
              mat-raised-button
              color="primary"
              [routerLink]="['/products', product._id, 'edit']"
            >
              <mat-icon>edit</mat-icon>
              Editar Producto
            </button>
            <button mat-button routerLink="/products">
              <mat-icon>list</mat-icon>
              Volver al catálogo
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .detail-container {
        max-width: 800px;
        margin: 0 auto;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;
      }

      .loading-container p {
        margin-top: 16px;
        color: #666;
      }

      .detail-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }

      .back-button {
        flex-shrink: 0;
      }

      .page-title {
        flex: 1;
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        color: #333;
      }

      .header-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .product-card {
        padding: 24px;
      }

      .product-header {
        margin-bottom: 24px;
      }

      .product-avatar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .product-title {
        font-size: 28px !important;
        font-weight: 500 !important;
        line-height: 1.2 !important;
      }

      .product-content {
        display: flex;
        flex-direction: column;
        gap: 32px;
      }

      .price-section {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #28a745;
      }

      .price-label {
        font-size: 18px;
        font-weight: 500;
        color: #333;
      }

      .price {
        font-size: 32px;
        font-weight: 600;
        color: #28a745;
      }

      .description-section h3,
      .category-section h3,
      .metadata-section h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
        color: #333;
        border-bottom: 2px solid #e9ecef;
        padding-bottom: 8px;
      }

      .description-section p {
        margin: 0;
        color: #666;
        line-height: 1.6;
        font-size: 16px;
      }

      .category-chip {
        background-color: #e3f2fd;
        color: #1976d2;
        font-size: 14px;
        padding: 8px 16px;
      }

      .metadata-grid {
        display: grid;
        gap: 16px;
      }

      .metadata-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;
      }

      .metadata-item strong {
        font-size: 14px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .metadata-item span {
        font-size: 16px;
        color: #333;
        font-family: 'Courier New', monospace;
      }

      .card-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e0e0e0;
        flex-wrap: wrap;
      }

      @media (max-width: 768px) {
        .detail-container {
          margin: 0;
          padding: 0 16px;
        }

        .detail-header {
          flex-direction: column;
          align-items: stretch;
        }

        .page-title {
          order: -1;
          text-align: center;
        }

        .header-actions {
          justify-content: center;
        }

        .product-card {
          padding: 16px;
        }

        .price-section {
          flex-direction: column;
          text-align: center;
          gap: 8px;
        }

        .price {
          font-size: 28px;
        }

        .card-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  product$: Observable<Product | null>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.product$ = this.store.select(ProductsSelectors.selectSelectedProduct);
    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.store.dispatch(ProductsActions.loadProduct({ id: productId }));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Producto',
        message: `¿Estás seguro de que deseas eliminar "${product.nombre}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(ProductsActions.deleteProduct({ id: product._id }));
        this.router.navigate(['/products']);
      }
    });
  }
}
