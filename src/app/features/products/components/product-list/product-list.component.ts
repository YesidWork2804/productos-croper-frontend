import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

// Store
import { Product, ProductFilter } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { AppState } from '../../../../core/models/api.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as ProductsActions from '../../../../store/products/products.actions';
import * as ProductsSelectors from '../../../../store/products/products.selectors';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    ProductCardComponent,
  ],
  template: `
    <div class="products-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <mat-icon>inventory_2</mat-icon>
            Catálogo de Productos
          </h1>
          <button mat-raised-button color="primary" routerLink="/products/new">
            <mat-icon>add</mat-icon>
            Nuevo Producto
          </button>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <form [formGroup]="filtersForm" class="filters-form">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar productos</mat-label>
            <input
              matInput
              formControlName="search"
              placeholder="Nombre o descripción..."
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="category-field">
            <mat-label>Categoría</mat-label>
            <mat-select formControlName="categoria">
              <mat-option value="">Todas las categorías</mat-option>
              <mat-option
                *ngFor="let category of categories$ | async"
                [value]="category"
              >
                {{ category }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button
            mat-button
            color="accent"
            (click)="clearFilters()"
            type="button"
          >
            <mat-icon>clear</mat-icon>
            Limpiar
          </button>
        </form>

        <!-- Active Filters -->
        <div class="active-filters" *ngIf="hasActiveFilters()">
          <span class="filters-label">Filtros activos:</span>
          <mat-chip-listbox class="filters-chips">
            <mat-chip-option
              *ngIf="filtersForm.get('search')?.value"
              (removed)="removeFilter('search')"
            >
              Búsqueda: "{{ filtersForm.get('search')?.value }}"
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip-option>
            <mat-chip-option
              *ngIf="filtersForm.get('categoria')?.value"
              (removed)="removeFilter('categoria')"
            >
              Categoría: {{ filtersForm.get('categoria')?.value }}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip-option>
          </mat-chip-listbox>
        </div>
      </mat-card>

      <!-- Loading -->
      <div class="loading-container" *ngIf="loading$ | async">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Cargando productos...</p>
      </div>

      <!-- Products Grid -->
      <div class="products-grid" *ngIf="!(loading$ | async)">
        <div class="grid-container">
          <app-product-card
            *ngFor="let product of products$ | async; trackBy: trackByProduct"
            [product]="product"
            (edit)="editProduct($event)"
            (delete)="deleteProduct($event)"
          >
          </app-product-card>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="(products$ | async)?.length === 0">
          <mat-icon class="empty-icon">inventory_2</mat-icon>
          <h3>No se encontraron productos</h3>
          <p *ngIf="hasActiveFilters()">
            No hay productos que coincidan con los filtros aplicados.
          </p>
          <p *ngIf="!hasActiveFilters()">
            Aún no hay productos en el catálogo.
          </p>
          <button mat-raised-button color="primary" routerLink="/products/new">
            <mat-icon>add</mat-icon>
            Crear primer producto
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <mat-card
        class="pagination-card"
        *ngIf="(products$ | async)?.length! > 0"
      >
        <mat-paginator
          [length]="total$ | async"
          [pageSize]="10"
          [pageSizeOptions]="[5, 10, 25, 50]"
          [pageIndex]="currentPage"
          (page)="onPageChange($event)"
          showFirstLastButtons
        >
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .products-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 24px;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }

      .page-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 28px;
        font-weight: 500;
        color: #333;
      }

      .filters-card {
        margin-bottom: 24px;
        padding: 20px;
      }

      .filters-form {
        display: flex;
        gap: 16px;
        align-items: flex-end;
        flex-wrap: wrap;
      }

      .search-field {
        flex: 1;
        min-width: 200px;
      }

      .category-field {
        min-width: 160px;
      }

      .active-filters {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
      }

      .filters-label {
        font-size: 14px;
        font-weight: 500;
        color: #666;
      }

      .filters-chips {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
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

      .products-grid {
        margin-bottom: 24px;
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;
        background: white;
        border-radius: 8px;
        border: 2px dashed #e0e0e0;
      }

      .empty-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #ccc;
        margin-bottom: 16px;
      }

      .empty-state h3 {
        margin: 0 0 8px 0;
        color: #666;
      }

      .empty-state p {
        margin: 0 0 24px 0;
        color: #999;
        max-width: 400px;
        line-height: 1.5;
      }

      .pagination-card {
        padding: 16px;
      }

      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          align-items: stretch;
        }

        .page-title {
          font-size: 24px;
        }

        .filters-form {
          flex-direction: column;
        }

        .search-field,
        .category-field {
          width: 100%;
        }

        .grid-container {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }
    `,
  ],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  filtersForm: FormGroup;
  currentPage = 0;

  // Observables
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  total$: Observable<number>;
  categories$: Observable<string[]>;
  filter$: Observable<ProductFilter>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.filtersForm = new FormGroup({
      search: new FormControl(''),
      categoria: new FormControl(''),
    });

    this.products$ = this.store.select(ProductsSelectors.selectProducts);
    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.total$ = this.store.select(ProductsSelectors.selectProductsTotal);
    this.categories$ = this.store.select(ProductsSelectors.selectCategories);
    this.filter$ = this.store.select(ProductsSelectors.selectProductsFilter);
  }

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadCategories());

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const filter: ProductFilter = {
          page: parseInt(params['page']) || 1,
          limit: parseInt(params['limit']) || 10,
          categoria: params['categoria'] || '',
          search: params['search'] || '',
        };

        this.filtersForm.patchValue(
          {
            search: filter.search,
            categoria: filter.categoria,
          },
          { emitEvent: false }
        );

        this.currentPage = (filter.page || 1) - 1;

        this.store.dispatch(ProductsActions.setFilter({ filter }));
        this.store.dispatch(ProductsActions.loadProducts({ filter }));
      });

    this.filtersForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByProduct(index: number, product: Product): string {
    return product._id;
  }

  hasActiveFilters(): boolean {
    const search = this.filtersForm.get('search')?.value;
    const categoria = this.filtersForm.get('categoria')?.value;
    return !!(search || categoria);
  }

  clearFilters(): void {
    this.filtersForm.reset();
    this.currentPage = 0;
    this.updateUrlParams({});
  }

  removeFilter(filterName: string): void {
    this.filtersForm.get(filterName)?.setValue('');
  }

  applyFilters(): void {
    this.currentPage = 0;
    const formValue = this.filtersForm.value;

    const params: any = {};
    if (formValue.search) params.search = formValue.search;
    if (formValue.categoria) params.categoria = formValue.categoria;

    this.updateUrlParams(params);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    const currentParams = this.route.snapshot.queryParams;

    this.updateUrlParams({
      ...currentParams,
      page: (event.pageIndex + 1).toString(),
      limit: event.pageSize.toString(),
    });
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products', product._id, 'edit']);
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Producto',
        message: `¿Estás seguro de que deseas eliminar "${product.nombre}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(ProductsActions.deleteProduct({ id: product._id }));
      }
    });
  }

  private updateUrlParams(params: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
