import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductsResponse,
  ProductFilter,
} from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(filter: ProductFilter): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('limit', filter.limit.toString());

    if (filter.categoria) {
      params = params.set('categoria', filter.categoria);
    }

    if (filter.search) {
      params = params.set('search', filter.search);
    }

    return this.http.get<ProductsResponse>(`${this.API_URL}/products`, {
      params,
    });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/products`, product);
  }

  updateProduct(id: string, product: UpdateProductDto): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.API_URL}/products/${id}`
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/products/categories`);
  }
}
