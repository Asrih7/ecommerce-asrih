import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { OrderBuyer } from "../models/orderBuyer";
import { OrderSeller } from "../models/orderSeller";
import { OrderToAcceptBySeller } from "../models/orderToAcceptBySeller";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    endpoint = 'order/';

    constructor(private httpClient: HttpClient) { }

    getOrdersBuyer(): Observable<OrderBuyer[]> {
        return this.httpClient.get<OrderBuyer[]>(`${environment.url}/${this.endpoint}order-buyer/`);
    }

    getOrdersBuyerById(id: string): Observable<OrderBuyer> {
        return this.httpClient.get<OrderBuyer>(`${environment.url}/${this.endpoint}order-buyer/${id}/`);
    }

    getOrdersSeller(): Observable<OrderSeller[]> {
        return this.httpClient.get<OrderSeller[]>(`${environment.url}/${this.endpoint}order-seller/`);
    }

    getOrdersSellerById(id: string): Observable<OrderSeller> {
        return this.httpClient.get<OrderSeller>(`${environment.url}/${this.endpoint}order-seller/${id}/`);
    }

    updateOrdersSeller(id: string, orderSeller: OrderSeller): Observable<OrderSeller> {
        return this.httpClient.put<OrderSeller>(`${environment.url}/${this.endpoint}order-seller/${id}`, orderSeller);
    }

    patchOrdersSeller(id: string, orderSeller: OrderSeller): Observable<OrderSeller> {
        return this.httpClient.patch<OrderSeller>(`${environment.url}/${this.endpoint}order-seller/${id}/`, orderSeller);
    }

    getOrderToAcceptBySeller(id: string): Observable<OrderToAcceptBySeller> {
        return this.httpClient.get<OrderToAcceptBySeller>(`${environment.url}/${this.endpoint}to-accept-by-seller/${id}`);
    }

    putOrderToAcceptBySeller(id: string, order: OrderToAcceptBySeller): Observable<OrderToAcceptBySeller> {
        return this.httpClient.put<OrderToAcceptBySeller>(`${environment.url}/${this.endpoint}to-accept-by-seller/${id}`, order);
    }

    patchOrderToAcceptBySeller(id: string, order: OrderToAcceptBySeller): Observable<OrderToAcceptBySeller> {
        return this.httpClient.patch<OrderToAcceptBySeller>(`${environment.url}/${this.endpoint}to-accept-by-seller/${id}`, order);
    }

    getFieldsOrderSeller(): Observable<any> {
        return this.httpClient.options(`${environment.url}/${this.endpoint}order-seller/`);
    }

    getFieldsOrderBuyer(): Observable<any> {
        return this.httpClient.options(`${environment.url}/${this.endpoint}order-buyer/`);
    }

    patchOrdersBuyer(id: string, orderBuyer: OrderBuyer): Observable<OrderBuyer> {
        return this.httpClient.patch<OrderBuyer>(`${environment.url}/${this.endpoint}order-buyer/${id}/`, orderBuyer);
    }

    getOrderBuyerById(id: string): Observable<OrderBuyer> {
        return this.httpClient.options<OrderBuyer>(`${environment.url}/${this.endpoint}order-buyer/${id}/`);
    }
    getOrderSellerById(id: string): Observable<OrderSeller> {
        return this.httpClient.options<OrderSeller>(`${environment.url}/${this.endpoint}order-seller/${id}/`);
    }
}
