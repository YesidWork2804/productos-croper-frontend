// src/app/store/products/products.actions.ts
import { createAction, props } from '@ngrx/store';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilter,
} from '../../core/models/product.model';

// Load Products
export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ filter: ProductFilter }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[]; total: number; totalPages: number }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

// Load Product
export const loadProduct = createAction(
  '[Products] Load Product',
  props<{ id: string }>()
);

export const loadProductSuccess = createAction(
  '[Products] Load Product Success',
  props<{ product: Product }>()
);

export const loadProductFailure = createAction(
  '[Products] Load Product Failure',
  props<{ error: string }>()
);

// Create Product
export const createProduct = createAction(
  '[Products] Create Product',
  props<{ product: CreateProductDto }>()
);

export const createProductSuccess = createAction(
  '[Products] Create Product Success',
  props<{ product: Product }>()
);

export const createProductFailure = createAction(
  '[Products] Create Product Failure',
  props<{ error: string }>()
);

// Update Product
export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ id: string; product: UpdateProductDto }>()
);

export const updateProductSuccess = createAction(
  '[Products] Update Product Success',
  props<{ product: Product }>()
);

export const updateProductFailure = createAction(
  '[Products] Update Product Failure',
  props<{ error: string }>()
);

// Delete Product
export const deleteProduct = createAction(
  '[Products] Delete Product',
  props<{ id: string }>()
);

export const deleteProductSuccess = createAction(
  '[Products] Delete Product Success',
  props<{ id: string }>()
);

export const deleteProductFailure = createAction(
  '[Products] Delete Product Failure',
  props<{ error: string }>()
);

// Load Categories
export const loadCategories = createAction('[Products] Load Categories');

export const loadCategoriesSuccess = createAction(
  '[Products] Load Categories Success',
  props<{ categories: string[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Products] Load Categories Failure',
  props<{ error: string }>()
);

// Filter Actions
export const setFilter = createAction(
  '[Products] Set Filter',
  props<{ filter: ProductFilter }>()
);

export const clearFilter = createAction('[Products] Clear Filter');

// UI Actions
export const selectProduct = createAction(
  '[Products] Select Product',
  props<{ product: Product | null }>()
);

export const clearError = createAction('[Products] Clear Error');

// src/app/store/products/products.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../../core/models/product.model';

export const selectProductsState =
  createFeatureSelector<ProductState>('products');

export const selectProducts = createSelector(
  selectProductsState,
  (state) => state.products
);

export const selectSelectedProduct = createSelector(
  selectProductsState,
  (state) => state.selectedProduct
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state.error
);

export const selectProductsFilter = createSelector(
  selectProductsState,
  (state) => state.filter
);

export const selectProductsTotal = createSelector(
  selectProductsState,
  (state) => state.total
);

export const selectProductsTotalPages = createSelector(
  selectProductsState,
  (state) => state.totalPages
);

export const selectCategories = createSelector(
  selectProductsState,
  (state) => state.categories
);

export const selectCurrentPage = createSelector(
  selectProductsFilter,
  (filter) => filter.page
);

export const selectProductsPerPage = createSelector(
  selectProductsFilter,
  (filter) => filter.limit
);

export const selectSearchTerm = createSelector(
  selectProductsFilter,
  (filter) => filter.search || ''
);

export const selectCategoryFilter = createSelector(
  selectProductsFilter,
  (filter) => filter.categoria || ''
);

export const selectProductById = (id: string) =>
  createSelector(
    selectProducts,
    (products) => products.find((product) => product._id === id) || null
  );
