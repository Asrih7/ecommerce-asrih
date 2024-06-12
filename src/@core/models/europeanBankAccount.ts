export interface EuropeanBankAccount {
    readonly id?: number;
    account_owner: string;
    iban: string;
    bic: string;
    bank_name: string;
    bank_city: string;
    bank_country: string;
}
