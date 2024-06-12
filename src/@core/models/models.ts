export interface Login {
    email?: string;
    password: string;
    code?: string;
}

export interface Logout {
    refresh: string;
}

export interface Translate {
    language: string;
    text: string;
}

export interface Shipping {
    id?: number;
    name: string;
    shop: number;
    zones: Array<Zone>;
}

export interface Zone {
    id?: number;
    readonly alone: string;
    readonly alone_currency: string;
    country?: string;
    delay?: string;
    inter?: string;
    minimum_order_amount?: string;
    minimum_order_amount_currency?: string;
    region?: string;
    with_another_items?: string;
    with_another_items_currency?: string;
}

export interface AuthPayload {
    user_id?: string,
    exp?: number
}
