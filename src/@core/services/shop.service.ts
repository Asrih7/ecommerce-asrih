import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Terms } from '../models/terms';
import { ReadOnlyShop } from '../models/readOnlyShop';
import { Shop } from '../models/shop';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  endpoint = 'shop/';
  misc = 'misc/';

  constructor(private httpClient: HttpClient) { }

  getListShops(id: string, owner: string, modifiedBefore: string, modifiedAfter: string, category: string, ordering: string): Observable<ReadOnlyShop> {
    const params = new HttpParams()
      .set('id', id)
      .set('modified_before', modifiedBefore)
      .set('modified_after', modifiedAfter)
      .set('ordering', ordering)
      .set('owner', owner);
    return this.httpClient.get<ReadOnlyShop>(`${environment.url}/${this.endpoint}shop/`, { params });
  }

  createShop(shop: any): Observable<Shop> {
    return this.httpClient.post<Shop>(`${environment.url}/${this.endpoint}shop/`, shop);
  }

  getShopById(id: string): Observable<Shop> {
    return this.httpClient.get<Shop>(`${environment.url}/${this.endpoint}shop/${id}`);
  }

  getShopByName(name: string): Observable<Shop[]> {
    return this.httpClient.get<Shop[]>(`${environment.url}/${this.endpoint}shop/?slug=${name}`);
  }

  putShopById(shop: Shop, id: number): Observable<Shop> {
    return this.httpClient.put<Shop>(`${environment.url}/${this.endpoint}shop/${id}/`, shop);
  }

  patchShopById(shop: any, id: number): Observable<Shop> {
    return this.httpClient.patch<Shop>(`${environment.url}/${this.endpoint}shop/${id}/`, shop);
  }

  deleteShopById(id: number): Observable<Shop> {
    return this.httpClient.delete<Shop>(`${environment.url}/${this.endpoint}shop/${id}/`);
  }

  getItemsOfShop(): Observable<Terms[]> {
    return this.httpClient.get<Terms[]>(`${environment.url}/${this.endpoint}shop/terms/`);
  }

  createItemOfShop(term: Terms): Observable<Terms> {
    return this.httpClient.post<Terms>(`${environment.url}/${this.endpoint}shop/terms/`, term);
  }

  getItemsOfShopById(id: string): Observable<Terms> {
    return this.httpClient.get<Terms>(`${environment.url}/${this.endpoint}shop/terms/${id}`);
  }

  putItemsOfShopById(id: string, term: Terms): Observable<Terms> {
    return this.httpClient.put<Terms>(`${environment.url}/${this.endpoint}shop/terms/${id}`, term);
  }

  patchItemsOfShopById(id: string, term: Terms): Observable<Terms> {
    return this.httpClient.patch<Terms>(`${environment.url}/${this.endpoint}shop/terms/${id}`, term);
  }

  getShopInfos(): Observable<any> {
    return this.httpClient.options<any>(`${environment.url}/${this.endpoint}shop/`);
  }
}
