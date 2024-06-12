
import { OrderLine } from './orderLine';

export interface OrderBuyer {
    readonly id?: number;
    readonly createdOn?: Date;
    readonly modifiedOn?: Date;
    referenceNumber: string;
    customer?: number;
    lines: Array<OrderLine>;
    billingAddress?: number;
    shippingAddress?: number;
    status: number;
    isGift?: boolean;
    message?: string;
    readonly taxfulTotalPriceBuyer?: string;
    readonly taxfulTotalPriceBuyerCurrency?: string;
    customerNote?: number;
    customerComment?: string;
    readonly merchantComment?: string;
}
