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
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
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
