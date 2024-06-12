

export interface Payment {
    readonly id?: number;
    paymentStatus: number;
    readonly createdOn?: Date;
    paymentIdentifier: string;
    description?: string;
    paymentData?: string;
    basket?: number;
    transfer?: number;
    gateway: number;
}
