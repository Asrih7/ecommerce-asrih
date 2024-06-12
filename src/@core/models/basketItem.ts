export interface BasketItem {
    basket_id?: number;
    currency?: string;
    customization_content?: any[];

    quantity?: number;
    shipping_zone?: any;
    shipping_zones_of_customer?: any[];
    shop?: number;
    shop_name?: string;
    inspiration_country?: string[];

    unit_price?: number;
    unit_promotional_price?: number;
    discount_amount?: number;
    variant: number;
    variant_name?: string;
}
