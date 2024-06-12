
import { OrderLine } from './orderLine';


export interface OrderToAcceptBySeller { 
    readonly id?: number;
    readonly createdOn?: Date;
    readonly modifiedOn?: Date;
    readonly referenceNumber?: string;
    readonly customer?: number;
    readonly lines?: Array<OrderLine>;
    readonly billingAddress?: number;
    readonly shippingAddress?: number;
    status: number;
    /**
     * Check True if yes
     */
    readonly isGift?: boolean;
    /**
     * Write your message.
     */
    readonly message?: string;
    readonly taxfulTotalPriceBuyer?: string;
    readonly taxfulTotalPriceBuyerCurrency?: string;
    readonly customerNote?: number;
    /**
     * Enter any comment for this shop. This will help the community of Noodra
     */
    readonly customerComment?: string;
    /**
     * Enter any comment for this customer about this order that is accessible to all.
     */
    readonly merchantComment?: string;
}
