import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../../core/models/product.model';

export const selectProductsState =
  createFeatureSelector<ProductState>('products');
export const selectProducts = createSelector(
  selectProductsState,
  (state) => state.products
);
export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);
export const selectCategories = createSelector(
  selectProductsState,
  (state) => state.categories
);
export const selectProductsTotal = createSelector(
  selectProductsState,
  (state) => state.total
);
export const selectSelectedProduct = createSelector(
  selectProductsState,
  (state) => state.selectedProduct
);

export const selectProductsFilter = createSelector(
  selectProductsState,
  (state) => state.filter
);
