export interface Wallet {
    readonly id?: number;
    user: number;
    balance: string;
    balance_currency: string;
    messages: string;
}

export interface CreateWallet {
    currency: string;
}

export interface Deposit{
    deposit_amount : string;
}

export interface PayPalServerAuth{
    orderID : string;
}
