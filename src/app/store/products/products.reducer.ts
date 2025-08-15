import { createReducer, on } from '@ngrx/store';
import { ProductState } from '../../core/models/product.model';
import * as ProductsActions from './products.actions';

export const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  filter: {
    page: 1,
    limit: 10,
  },
  totalPages: 0,
  total: 0,
  loading: false,
  error: null,
  categories: [],
};

export const productsReducer = createReducer(
  initialState,

  // Load Products
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    ProductsActions.loadProductsSuccess,
    (state, { products, total, totalPages }) => ({
      ...state,
      products,
      total,
      totalPages,
      loading: false,
      error: null,
    })
  ),

  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Product
  on(ProductsActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loading: false,
    error: null,
  })),

  on(ProductsActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Product
  on(ProductsActions.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.createProductSuccess, (state, { product }) => ({
    ...state,
    products: [product, ...state.products],
    total: state.total + 1,
    loading: false,
    error: null,
  })),

  on(ProductsActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Product
  on(ProductsActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p._id === product._id ? product : p)),
    selectedProduct: product,
    loading: false,
    error: null,
  })),

  on(ProductsActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Product
  on(ProductsActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter((p) => p._id !== id),
    total: state.total - 1,
    selectedProduct:
      state.selectedProduct?._id === id ? null : state.selectedProduct,
    loading: false,
    error: null,
  })),

  on(ProductsActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Categories
  on(ProductsActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
  })),

  on(ProductsActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Filter
  on(ProductsActions.setFilter, (state, { filter }) => ({
    ...state,
    filter: { ...state.filter, ...filter },
  })),

  on(ProductsActions.clearFilter, (state) => ({
    ...state,
    filter: initialState.filter,
  })),

  // UI
  on(ProductsActions.selectProduct, (state, { product }) => ({
    ...state,
    selectedProduct: product,
  })),

  on(ProductsActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
