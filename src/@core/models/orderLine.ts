


export interface OrderLine {
    readonly id?: number;
    order: number;
    product?: number;
    parentLine?: number;
    type: number;
    text: string;
    sku?: string;
    quantity?: number;
    unitPriceBuyer?: string;
    readonly unitPriceBuyerCurrency?: string;
}
