
import { EuropeanBankAccount } from './europeanBankAccount';
import { InternationalBankAccount } from './internationalBankAccount';
import { PaypalAccount } from './paypalAccount';
import { WesternUnionAccount } from './westernUnionAccount';

export interface Transfer {
    readonly wallet?: number;
    transfer_amount?: number;
    readonly transfer_amount_currency?: string;
    transfer_type?: string;
    paypal_account?: PaypalAccount;
    western_union_account?: WesternUnionAccount;
    european_bank_account?: EuropeanBankAccount;
    international_bank_account?: InternationalBankAccount;
    password?: string;
}
