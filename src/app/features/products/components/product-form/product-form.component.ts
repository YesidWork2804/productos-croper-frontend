import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as ProductsActions from '../../../../store/products/products.actions';
import * as ProductsSelectors from '../../../../store/products/products.selectors';

import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from '../../../../core/models/product.model';
import { AppState } from '../../../../core/models/api.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="page-title">
          <mat-icon>{{ isEditMode ? 'edit' : 'add_box' }}</mat-icon>
          {{ isEditMode ? 'Editar' : 'Nuevo' }} Producto
        </h1>
      </div>

      <mat-card class="form-card">
        <mat-card-content>
          <form
            [formGroup]="productForm"
            (ngSubmit)="onSubmit()"
            class="product-form"
          >
            <!-- Nombre -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre del producto</mat-label>
              <input
                matInput
                formControlName="nombre"
                placeholder="Ej: iPhone 15 Pro"
              />
              <mat-icon matSuffix>inventory_2</mat-icon>
              <mat-error
                *ngIf="productForm.get('nombre')?.hasError('required')"
              >
                El nombre es requerido
              </mat-error>
              <mat-error
                *ngIf="productForm.get('nombre')?.hasError('maxlength')"
              >
                El nombre no puede exceder 100 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Descripción -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea
                matInput
                formControlName="descripcion"
                placeholder="Describe las características del producto..."
                rows="4"
              ></textarea>
              <mat-icon matSuffix>description</mat-icon>
              <mat-error
                *ngIf="productForm.get('descripcion')?.hasError('maxlength')"
              >
                La descripción no puede exceder 500 caracteres
              </mat-error>
            </mat-form-field>

            <!-- Precio y Categoría en fila -->
            <div class="form-row">
              <mat-form-field appearance="outline" class="flex-field">
                <mat-label>Precio</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="precio"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                />
                <span matTextPrefix>$&nbsp;</span>
                <mat-icon matSuffix>attach_money</mat-icon>
                <mat-error
                  *ngIf="productForm.get('precio')?.hasError('required')"
                >
                  El precio es requerido
                </mat-error>
                <mat-error *ngIf="productForm.get('precio')?.hasError('min')">
                  El precio debe ser mayor que 0
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="flex-field">
                <mat-label>Categoría</mat-label>
                <mat-select formControlName="categoria">
                  <mat-option
                    *ngFor="let category of categories$ | async"
                    [value]="category"
                  >
                    {{ category }}
                  </mat-option>
                  <mat-option value="nueva-categoria">
                    <mat-icon>add</mat-icon>
                    Nueva categoría...
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>category</mat-icon>
                <mat-error
                  *ngIf="productForm.get('categoria')?.hasError('required')"
                >
                  La categoría es requerida
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Nueva categoría (condicional) -->
            <mat-form-field
              appearance="outline"
              class="full-width"
              *ngIf="productForm.get('categoria')?.value === 'nueva-categoria'"
            >
              <mat-label>Nueva categoría</mat-label>
              <input
                matInput
                formControlName="nuevaCategoria"
                placeholder="Nombre de la nueva categoría"
              />
              <mat-icon matSuffix>new_label</mat-icon>
              <mat-error
                *ngIf="productForm.get('nuevaCategoria')?.hasError('required')"
              >
                El nombre de la categoría es requerido
              </mat-error>
            </mat-form-field>

            <!-- Vista previa -->
            <div class="preview-section" *ngIf="productForm.valid">
              <h3>Vista previa</h3>
              <div class="product-preview">
                <div class="preview-header">
                  <mat-icon class="preview-icon">inventory_2</mat-icon>
                  <div class="preview-info">
                    <h4>{{ productForm.get('nombre')?.value }}</h4>
                    <span class="preview-category">{{
                      getFinalCategory()
                    }}</span>
                  </div>
                  <span class="preview-price">
                    {{
                      productForm.get('precio')?.value
                        | currency : 'USD' : 'symbol' : '1.2-2'
                    }}
                  </span>
                </div>
                <p
                  class="preview-description"
                  *ngIf="productForm.get('descripcion')?.value"
                >
                  {{ productForm.get('descripcion')?.value }}
                </p>
              </div>
            </div>

            <div class="form-actions">
              <button
                mat-button
                type="button"
                (click)="goBack()"
                [disabled]="loading$ | async"
              >
                Cancelar
              </button>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="productForm.invalid || (loading$ | async)"
              >
                <mat-spinner
                  diameter="20"
                  *ngIf="loading$ | async"
                ></mat-spinner>
                <mat-icon *ngIf="!(loading$ | async)">
                  {{ isEditMode ? 'save' : 'add' }}
                </mat-icon>
                <span>{{ isEditMode ? 'Actualizar' : 'Crear' }} Producto</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        max-width: 800px;
        margin: 0 auto;
      }

      .form-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
      }

      .back-button {
        flex-shrink: 0;
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

      .form-card {
        padding: 24px;
      }

      .product-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .full-width {
        width: 100%;
      }

      .form-row {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }

      .flex-field {
        flex: 1;
      }

      .preview-section {
        margin-top: 24px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
      }

      .preview-section h3 {
        margin: 0 0 16px 0;
        color: #495057;
        font-size: 16px;
        font-weight: 500;
      }

      .product-preview {
        background: white;
        padding: 16px;
        border-radius: 6px;
        border: 1px solid #dee2e6;
      }

      .preview-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .preview-icon {
        color: #6c757d;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .preview-info {
        flex: 1;
      }

      .preview-info h4 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: #212529;
      }

      .preview-category {
        font-size: 14px;
        color: #6c757d;
        background: #e9ecef;
        padding: 2px 8px;
        border-radius: 12px;
        display: inline-block;
        margin-top: 4px;
      }

      .preview-price {
        font-size: 20px;
        font-weight: 600;
        color: #28a745;
      }

      .preview-description {
        margin: 0;
        color: #6c757d;
        line-height: 1.5;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid #e0e0e0;
      }

      .form-actions button {
        min-width: 120px;
      }

      mat-spinner {
        margin-right: 8px;
      }

      @media (max-width: 768px) {
        .form-container {
          margin: 0;
          padding: 0 16px;
        }

        .page-title {
          font-size: 24px;
        }

        .form-card {
          padding: 16px;
        }

        .form-row {
          flex-direction: column;
          gap: 0;
        }

        .form-actions {
          flex-direction: column-reverse;
        }

        .form-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;

  loading$: Observable<boolean>;
  categories$: Observable<string[]>;
  selectedProduct$: Observable<Product | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      categoria: ['', [Validators.required]],
      nuevaCategoria: [''],
    });

    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.categories$ = this.store.select(ProductsSelectors.selectCategories);
    this.selectedProduct$ = this.store.select(
      ProductsSelectors.selectSelectedProduct
    );
  }

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadCategories());

    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.store.dispatch(ProductsActions.loadProduct({ id: this.productId }));

      this.selectedProduct$
        .pipe(
          takeUntil(this.destroy$),
          filter((product) => !!product)
        )
        .subscribe((product) => {
          if (product) {
            this.productForm.patchValue({
              nombre: product.nombre,
              descripcion: product.descripcion || '',
              precio: product.precio,
              categoria: product.categoria,
            });
          }
        });
    }

    this.productForm
      .get('categoria')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const nuevaCategoriaControl = this.productForm.get('nuevaCategoria');

        if (value === 'nueva-categoria') {
          nuevaCategoriaControl?.setValidators([Validators.required]);
        } else {
          nuevaCategoriaControl?.clearValidators();
          nuevaCategoriaControl?.setValue('');
        }
        nuevaCategoriaControl?.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      const categoria = this.getFinalCategory();

      const productData = {
        nombre: formValue.nombre,
        descripcion: formValue.descripcion || undefined,
        precio: Number(formValue.precio),
        categoria: categoria,
      };

      if (this.isEditMode && this.productId) {
        const updateData: UpdateProductDto = productData;
        this.store.dispatch(
          ProductsActions.updateProduct({
            id: this.productId,
            product: updateData,
          })
        );
      } else {
        const createData: CreateProductDto = productData;
        this.store.dispatch(
          ProductsActions.createProduct({ product: createData })
        );
      }

      this.goBack();
    }
  }

  getFinalCategory(): string {
    const categoria = this.productForm.get('categoria')?.value;
    if (categoria === 'nueva-categoria') {
      return this.productForm.get('nuevaCategoria')?.value || '';
    }
    return categoria || '';
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
