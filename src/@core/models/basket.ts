import { BasketItem } from "./basketItem";

export interface Basket {
    id?: number;
    billing_address?: any;
    currency?: string;
    customer?: any;
    discount: string;
    items?: BasketItem[];
    shipping_address?: any;
    wallet_amount_to_debit?: any;
}
