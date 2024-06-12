import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isString } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EuropeanBankAccount } from '../models/europeanBankAccount';
import { InternationalBankAccount } from '../models/internationalBankAccount';
import { PaypalAccount } from '../models/paypalAccount';
import { Transfer } from '../models/transfer';
import { CreateWallet, Deposit, PayPalServerAuth, Wallet } from '../models/wallet';
import { WesternUnionAccount } from '../models/westernUnionAccount';
import { Stripe, StripeCardElement, StripeElements,loadStripe } from '@stripe/stripe-js';
@Injectable({ providedIn: 'root' })
export class WalletService {
  endpoint = 'wallet/';

  private waletSubject$ = new BehaviorSubject<Wallet | null>(null);
  public walet$ = this.waletSubject$.asObservable();
  stripePromise: Promise<Stripe | null>;
  constructor(
    private httpClient: HttpClient,
    private toaster: ToastrService,
    private translate: TranslateService
  ) { 
    this.stripePromise = loadStripe('pk_test_51HxnSaJSBlIBLSiyW9it3S3agrpmhbseZhsfY1Hoz7LJgaOiPWyCdM8O8AwhQb7nbcnFNZWJEQU2gMfOgPUEXKP100FUpWwvPB');
  }

  getAccountEuropean(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpoint}european-account/`);
  }

  getAccountInternational(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpoint}international-account/`);
  }

  getAccountPaypal(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpoint}paypal-account/`);
  }

  getAccountWesternunion(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpoint}westernunion-account/`);
  }

  updateAccountEuropean(accountEuropean: EuropeanBankAccount): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpoint}european-account/`, accountEuropean);
  }

  updateAccountInternational(accountInternation: InternationalBankAccount): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpoint}international-account/`, accountInternation);
  }

  updateAccountPaypal(accountPaypal: PaypalAccount): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpoint}paypal-account/`, accountPaypal);
  }

  updateAccountWesternunion(accountWesternunion: WesternUnionAccount): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpoint}westernunion-account/`, accountWesternunion);
  }

  deleteAccountEuropean(id: any): Observable<any> {
    return this.httpClient.delete<any>(`${environment.url}/${this.endpoint}european-account/${id}/`);
  }

  deleteAccountInternational(id: any): Observable<any> {
    return this.httpClient.delete<any>(`${environment.url}/${this.endpoint}international-account/${id}/`);
  }

  deleteAccountPaypal(id: any): Observable<any> {
    return this.httpClient.delete<any>(`${environment.url}/${this.endpoint}paypal-account/${id}/`);
  }

  deleteAccountWesternunion(id: any): Observable<any> {
    return this.httpClient.delete<any>(`${environment.url}/${this.endpoint}westernunion-account/${id}/`);
  }

  updateWallet(wallet: Wallet): Observable<any> {
    return this.httpClient.post(`${environment.url}/${this.endpoint}${this.endpoint}`, wallet);
  }

  getWallet(): Observable<Wallet> {
    return this.httpClient.get<Wallet>(`${environment.url}/${this.endpoint}${this.endpoint}current/`)
      .pipe(tap(wallet => {
        this.waletSubject$.next(wallet);
      }), catchError(error => {
        if (error?.status === 403) {
          const emptyWallet: Wallet = {
            balance: '',
            balance_currency: '',
            id: 0,
            user: 0,
            messages: error.error.detail
          };

          this.waletSubject$.next(emptyWallet);
        }

        return error as Observable<Wallet>;
      }));
  }

  getTransaction(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpoint}transaction/`);
  }

  getTransfer(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpoint}transfer/`);
  }

  createTransfer(transfer: Transfer): Observable<any> {
    return this.httpClient.post(`${environment.url}/${this.endpoint}transfer/`, transfer);
  }

  getFieldsTransfer(): Observable<any> {
    return this.httpClient.options(`${environment.url}/${this.endpoint}transfer/`);
  }

  getFieldsTransaction(): Observable<any> {
    return this.httpClient.options(`${environment.url}/${this.endpoint}transaction/`);
  }

  getWalletCurrent(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpoint}wallet/current/`);
  }

  getWalletFeilds(): Observable<any> {
    return this.httpClient.options(`${environment.url}/${this.endpoint}${this.endpoint}`);
  }

  createWallet(createWallet: CreateWallet): Observable<any> {
    return this.httpClient.post(`${environment.url}/${this.endpoint}${this.endpoint}`, createWallet);
  }

  getFieldsDeposit(): Observable<any> {
    return this.httpClient.options(`${environment.url}/${this.endpoint}deposit/`);
  }

  sendDepositAmount(deposit: Deposit) {
    return this.httpClient.post(`${environment.url}/${this.endpoint}deposit/`, deposit);
  }

  createPaypalDepositV2() {
    return this.httpClient.post(`${environment.url}/payment/paypal-create-deposit-v2/`, {}).pipe(map((val: any) => {
      if (isString(val.linkForPayment)) return val.linkForPayment.split('token=')[1] ?? ''
      return ''
    }));
  }

  authorizePaypalPayment(captureObj: PayPalServerAuth) {
    return this.httpClient.post(`${environment.url}/payment/paypal-capture-deposit-v2/`, captureObj).pipe(map((val: any) => {
      console.log(val)
      if (val?.Success === true) {
        this.toasterTransactionSuccess();
      } else {
        this.toasterTransactionError();
      }
      return val
    }));
  }

  toasterTransactionSuccess() {
    this.toaster.success(this.translate.instant('wallet.credit.transaction_success'));
  }

  toasterTransactionError() {
    this.toaster.error(this.translate.instant('wallet.credit.transaction_error'));
  }

  setWallet(wallet: Wallet | null) {
    this.waletSubject$.next(wallet);
  }

  async createPaymentIntent(payementId: string,memorizeBankCard?:boolean) {
    return this.httpClient.post<any>(`${environment.url}/payment/stripe-payment-intent-deposit/`, {payment_method_id:payementId,memorize_bank_card:memorizeBankCard});
  }

  getPaymentIntent() {
    return this.httpClient.get<any>(`${environment.url}/payment/stripe-payment-method`);
  }

  deletePaymentCard(payment_method_id_to_delete:any) {
    return this.httpClient.put<any>(`${environment.url}/payment/stripe-payment-method/`,{payment_method_id_to_delete:payment_method_id_to_delete});
  }

  async getStripeElements(): Promise<StripeElements> {
    const stripe = await this.stripePromise;
    return stripe!.elements();
  }

  async getStripe(): Promise<Stripe | null> {
    const stripe = await this.stripePromise;
    if(stripe) return stripe
    else return null
  }

  loadStripeChargeDeposite(params: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/payment/stripe-charge-deposit/`, params);
  }
}
