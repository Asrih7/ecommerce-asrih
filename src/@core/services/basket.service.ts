import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Basket } from "../models/basket";

@Injectable({
    providedIn: 'root'
})
export class BasketService {
    endpoint = 'basket/';
    private basketSub$: BehaviorSubject<Basket | null> = new BehaviorSubject<Basket | null>(null);
    public basket$: Observable<Basket | null> = this.basketSub$.asObservable();

    constructor(private httpClient: HttpClient) { }

    postBasketItem(basket: any): Observable<any> {
        return this.httpClient.post<any>(`${environment.url}/${this.endpoint}basket_item/`, basket);
    }

    getBasket(): Observable<Basket> {
        return this.httpClient.get<Basket>(`${environment.url}/${this.endpoint}basket/current/`)
            .pipe(tap(basket => { this.basketSub$.next(basket as (Basket | null)) }));
    }

    putBasketDiscount(basket: any): Observable<any> {
        return this.httpClient.put<any>(`${environment.url}/${this.endpoint}basket/current/`, basket);
    }

    setBasket(basket: any) {
        this.basketSub$.next(basket as (Basket | null));
    }
}


