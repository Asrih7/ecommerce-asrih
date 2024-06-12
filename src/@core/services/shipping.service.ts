import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shipping } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ShippingService {
    endpoint = 'shipping/';
    constructor(private httpClient: HttpClient) { }

    getShipping(shopId: number): Observable<Shipping> {
        return this.httpClient.get<Shipping>(`${environment.url}/${this.endpoint}shop/${shopId}/${this.endpoint}`);
    }
    postShipping(shopId: number, shipping: Shipping): Observable<Shipping> {
        return this.httpClient.post<Shipping>(`${environment.url}/${this.endpoint}shop/${shopId}/${this.endpoint}`, shipping);
    }
    updateShipping(shopId: number, id: number, shipping: Shipping): Observable<Shipping> {
        return this.httpClient.put<Shipping>(`${environment.url}/${this.endpoint}shop/${shopId}/${this.endpoint}${id}`, shipping);
    }
    patchShipping(shopId: number, id: number, shipping: Shipping): Observable<Shipping> {
        return this.httpClient.patch<Shipping>(`${environment.url}/${this.endpoint}shop/${shopId}/${this.endpoint}${id}/`, shipping);
    }
    deleteShipping(shopId: number, id: number): Observable<Shipping> {
        return this.httpClient.delete<Shipping>(`${environment.url}/${this.endpoint}shop/${shopId}/${this.endpoint}${id}/`);
    }
    getInformationsShipping(shopId: number): Observable<any> {
        return this.httpClient.options<any>(`${environment.url}/${this.endpoint}shop/${shopId}/${this.endpoint}`);
    }
    getRequiredShippingZones(shopId: number): Observable<any> {
        return this.httpClient.get<any>(`${environment.url}/${this.endpoint}shop/${shopId}/required-shipping-zones/`);
    }
}
