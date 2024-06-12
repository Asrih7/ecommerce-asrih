import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  endpoint = 'wishlist/';
  constructor(private httpClient: HttpClient) { }

  private wishlistSubject$ = new BehaviorSubject<any>(null);
  public wishlist$ = this.wishlistSubject$.asObservable();

  getWishlist(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpoint}wishlist/current/`)
      .pipe(tap(wishlist => { this.setWishlist(wishlist); }));
  }

  addProductToWishlist(productId: number): Observable<any> {
    const wisthObject = { shops: [], products: [productId] }
    return this.httpClient.patch<any>(`${environment.url}/${this.endpoint}wishlist/current/add/`, wisthObject)
      .pipe(tap(() => {
        this.getWishlist().subscribe();
      }));
  }

  deleteProductFromWishlist(productId: number): Observable<any> {
    const wisthObject = { shops: [], products: [productId] }
    return this.httpClient.patch<any>(`${environment.url}/${this.endpoint}wishlist/current/delete/`, wisthObject);
  }

  setWishlist(wishlist: any) {
    this.wishlistSubject$.next(wishlist);
  }
}
