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
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  filtersForm: FormGroup;
  currentPage = 0;

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
