import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as ProductsActions from './products.actions';
import { ProductsService } from '../../core/service/products.service';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(({ filter }) =>
        this.productsService.getProducts(filter).pipe(
          map((response) =>
            ProductsActions.loadProductsSuccess({
              products: response.productos,
              total: response.total,
              totalPages: response.totalPages,
            })
          ),
          catchError((error) =>
            of(
              ProductsActions.loadProductsFailure({
                error: error.error?.message || 'Error al cargar productos',
              })
            )
          )
        )
      )
    )
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProduct),
      switchMap(({ id }) =>
        this.productsService.getProduct(id).pipe(
          map((product) => ProductsActions.loadProductSuccess({ product })),
          catchError((error) =>
            of(
              ProductsActions.loadProductFailure({
                error: error.error?.message || 'Error al cargar producto',
              })
            )
          )
        )
      )
    )
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.createProduct),
      exhaustMap(({ product }) =>
        this.productsService.createProduct(product).pipe(
          map((newProduct) =>
            ProductsActions.createProductSuccess({ product: newProduct })
          ),
          catchError((error) =>
            of(
              ProductsActions.createProductFailure({
                error: error.error?.message || 'Error al crear producto',
              })
            )
          )
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateProduct),
      exhaustMap(({ id, product }) =>
        this.productsService.updateProduct(id, product).pipe(
          map((updatedProduct) =>
            ProductsActions.updateProductSuccess({ product: updatedProduct })
          ),
          catchError((error) =>
            of(
              ProductsActions.updateProductFailure({
                error: error.error?.message || 'Error al actualizar producto',
              })
            )
          )
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.deleteProduct),
      exhaustMap(({ id }) =>
        this.productsService.deleteProduct(id).pipe(
          map(() => ProductsActions.deleteProductSuccess({ id })),
          catchError((error) =>
            of(
              ProductsActions.deleteProductFailure({
                error: error.error?.message || 'Error al eliminar producto',
              })
            )
          )
        )
      )
    )
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadCategories),
      switchMap(() =>
        this.productsService.getCategories().pipe(
          map((categories) =>
            ProductsActions.loadCategoriesSuccess({ categories })
          ),
          catchError((error) =>
            of(
              ProductsActions.loadCategoriesFailure({
                error: error.error?.message || 'Error al cargar categorías',
              })
            )
          )
        )
      )
    )
  );

  // Success Messages
  createProductSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.createProductSuccess),
        tap(() => {
          this.snackBar.open('Producto creado exitosamente', 'Cerrar', {
            duration: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  updateProductSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.updateProductSuccess),
        tap(() => {
          this.snackBar.open('Producto actualizado exitosamente', 'Cerrar', {
            duration: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  deleteProductSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.deleteProductSuccess),
        tap(() => {
          this.snackBar.open('Producto eliminado exitosamente', 'Cerrar', {
            duration: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  // Error Messages
  errorMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ProductsActions.loadProductsFailure,
          ProductsActions.loadProductFailure,
          ProductsActions.createProductFailure,
          ProductsActions.updateProductFailure,
          ProductsActions.deleteProductFailure,
          ProductsActions.loadCategoriesFailure
        ),
        tap(({ error }) => {
          this.snackBar.open(error, 'Cerrar', { duration: 5000 });
        })
      ),
    { dispatch: false }
  );
}
