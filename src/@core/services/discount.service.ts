import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BasketItem } from '../models/basketItem';
import { Deal } from '../models/deal';
import { Discount } from '../models/discount';


@Injectable({
    providedIn: 'root'
})
export class DiscountService {
    endpoint = 'discount/';
    private priceChangeSubject$ = new BehaviorSubject<boolean>(false);
    public priceChange$ = this.priceChangeSubject$.asObservable();


    constructor(private httpClient: HttpClient) { }

    getDeal(shopId: string): Observable<Deal> {
        return this.httpClient.get<Deal>(`${environment.url}/${this.endpoint}shop/${shopId}/deal/`);
    }

    createDeal(shopId: string, deal: Deal): Observable<BasketItem> {
        return this.httpClient.post<BasketItem>(`${environment.url}/${this.endpoint}shop/${shopId}/deal/`, deal);
    }

    getDealOfDiscount(shopId: string, id: string): Observable<Deal> {
        return this.httpClient.get<Deal>(`${environment.url}/${this.endpoint}shop/${shopId}/deal/${id}`);
    }

    updateDealOfDiscount(shopId: string, id: string, deal: Deal): Observable<Deal> {
        return this.httpClient.put<Deal>(`${environment.url}/${this.endpoint}shop/${shopId}/deal/${id}`, deal);
    }

    patchDealOfDiscount(shopId: string, id: string, deal: Deal): Observable<Deal> {
        return this.httpClient.patch<Deal>(`${environment.url}/${this.endpoint}shop/${shopId}/deal/${id}/`, deal);
    }

    getAllDiscountByShopId(shopId: string): Observable<Discount[]> {
        return this.httpClient.get<Discount[]>(`${environment.url}/${this.endpoint}shop/${shopId}/discount/`);
    }

    createDiscount(shopId: string, discount: Discount): Observable<Discount> {
        return this.httpClient.post<Discount>(`${environment.url}/${this.endpoint}shop/${shopId}/discount/`, discount);
    }


    getDiscountByShopId(shopId: string, id: string): Observable<Discount> {
        return this.httpClient.get<Discount>(`${environment.url}/${this.endpoint}shop/${shopId}/discount/${id}`);
    }

    updateDiscount(shopId: string, id: string, discount: Discount): Observable<Discount> {
        return this.httpClient.put<Discount>(`${environment.url}/${this.endpoint}shop/${shopId}/discount/${id}/`, discount);
    }

    getInfomationsDeal(shopId: string): Observable<any> {
        return this.httpClient.options<Deal>(`${environment.url}/${this.endpoint}shop/${shopId}/deal/`);
    }

    getInfomationsDiscount(shopId: string): Observable<any> {
        return this.httpClient.options<Discount>(`${environment.url}/${this.endpoint}shop/${shopId}/discount/`);
    }

    deleteDeal(dealId: number, shopId: number): Observable<any> {
        return this.httpClient.delete<any>(`${environment.url}/${this.endpoint}shop/${shopId}/deal/${dealId}/`);
    }

    deleteDiscount(discountId: number, shopId: number): Observable<any> {
        return this.httpClient.delete<any>(`${environment.url}/${this.endpoint}shop/${shopId}/discount/${discountId}/`);
    }

    discountChanged() {
        this.priceChangeSubject$.next(true);
    }
}
