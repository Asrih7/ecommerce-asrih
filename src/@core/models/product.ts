
export interface Product {
    readonly id?: number;
    translations: string;
    readonly createdOn?: Date;
    readonly modifiedOn?: Date;
    shop: number;
    is_visible: boolean;
    shippingProfiles: Array<number>;
    category: number;
    customizable?: boolean;
}
