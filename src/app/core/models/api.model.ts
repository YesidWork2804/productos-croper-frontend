import { AuthState } from './auth.model';
import { Product, ProductFilter } from './product.model';

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export interface LoadingState {
  [key: string]: boolean;
}

export interface AppState {
  auth: AuthState;
  products: ProductState;
  ui: UiState;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  filter: ProductFilter;
  totalPages: number;
  total: number;
  loading: boolean;
  error: string | null;
  categories: string[];
}

export interface UiState {
  loading: LoadingState;
  sidenavOpen: boolean;
  theme: 'light' | 'dark';
}
