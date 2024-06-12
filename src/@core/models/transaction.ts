


export interface Transaction {
    readonly id?: number;
    wallet: number;
    readonly created_on?: Date;
    description: string;
    transaction_amount?: string;
}
