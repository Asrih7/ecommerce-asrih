export interface InternationalBankAccount {
    readonly id?: number;
    account_owner: string;
    birth_date: string;
    account_number: string;
    tri_number: string;
    iban?: string;
    bic?: string;
    bank_name: string;
    bank_city: string;
    bank_country: string;
    account_address: number;
}

