export interface Product {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
}

export interface UpdateProductDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
}

export interface ProductsResponse {
  productos: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductFilter {
  page: number;
  limit: number;
  categoria?: string;
  search?: string;
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

export interface AppState {
  auth: import('./auth.model').AuthState;
  products: ProductState;
}
