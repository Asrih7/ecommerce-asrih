import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient
  ) { }

  getInformationProduct(shopId: number): Observable<any> {
    return this.http.options(`${environment.url}/product/shop/${shopId}/product/`);
  }

  postProduct(data: any, shopId: number): Observable<any> {
    return this.http.post(`${environment.url}/product/shop/${shopId}/product/`, data);
  }

  putProduct(data: any, shopId: number, productId: number): Observable<any> {
    return this.http.put(`${environment.url}/product/shop/${shopId}/product/${productId}/`, data);
  }

  getProductAttributeByCategory(categoryId: number) {
    return this.http.get(`${environment.url}/product/category/${categoryId}/attribute/`);
  }

  getProductAttributeFields(categoryId: number) {
    return this.http.options(`${environment.url}/product/category/${categoryId}/attribute/`);
  }

  getShopProducts(shopId: string, itemsPerPage: number, currentPage: number): Observable<any> {
    return this.http.get<any>(`${environment.url}/product/shop/${shopId}/product/?limit=${itemsPerPage}&offset=${currentPage}`);
  }

  deleteShopProduct(shopId: string, productId: string): Observable<any> {
    return this.http.delete<any>(`${environment.url}/product/shop/${shopId}/product/${productId}/`);
  }

  getProducts(query: string, limit: number, offset: number): Observable<any> {
    return this.http.get<any>(`${environment.url}/product/product/?${query}${query ? '&' : ''}limit=${limit}&offset=${offset}`);
  }

  getInformationsProducts(query: string): Observable<any> {
    return this.http.options<any>(`${environment.url}/product/product/?${query}`);
  }

  getShopProductById(shopId: string, productId: string): Observable<any> {
    return this.http.get<any>(`${environment.url}/product/shop/${shopId}/product/${productId}/`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url}/product/product/${id}/`);
  }

  getInformationsProduct(id: number): Observable<any> {
    return this.http.options<any>(`${environment.url}/product/product/${id}/`);
  }

  getImageProduct(url: string): Observable<any> {
    const headers = new HttpHeaders().set('Accept-Ranges', 'bytes');
    return this.http.get(url, { responseType: 'blob', headers });
  }
}
