
import { OrderLine } from './orderLine';


export interface OrderSeller { 
    readonly id?: number;
    readonly createdOn?: Date;
    readonly modifiedOn?: Date;
    referenceNumber: string;
    customer?: number;
    status: number;
    lines: Array<OrderLine>;
    billingAddress?: number;
    shippingAddress?: number;
    /**
     * Check True if yes
     */
    isGift?: boolean;
    /**
     * Write your message.
     */
    message?: string;
    readonly taxfulTotalPriceSeller?: string;
    readonly taxfulTotalPriceSellerCurrency?: string;
    readonly taxlessTotalPriceSeller?: string;
    readonly taxlessTotalPriceSellerCurrency?: string;
    readonly gatewayCommission?: string;
    readonly gatewayCommissionCurrency?: string;
    readonly affiliationCommission?: string;
    readonly affiliationCommissionCurrency?: string;
    /**
     * Enter the tracking URL. Usually it's the website of the shipping company followed by the tracking number. This allows the customer to track the status of their package with one click. If you do not mention this URL and the customer claims his package as not received, you will be required to reimburse him according to the general conditions of sale.
     */
    refusalReason?: string;
    trackingUrl?: string;
    readonly customerNote?: number;
    
    /**
     * Enter any comment for this shop. This will help the community of Noodra
     */
    readonly customerComment?: string;
    /**
     * Enter any comment for this customer about this order that is accessible to all.
     */
    merchantComment?: string;
}
