
export interface WesternUnionAccount {
    readonly id?: number;
    first_name: string;
    last_name: string;
    receiving_city: string;
    state: string;
    region?: string;
    country: string;
}
