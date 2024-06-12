


export interface Discount { 
    readonly id?: number;
    coupon_code: string;
    discount_amount?: string;
    readonly discount_amount_currency?: string;
    discount_percentage?: string;
    shop: number;
    product: number;
    active?: boolean;
    start_date?: string;
    end_date: string;
}
