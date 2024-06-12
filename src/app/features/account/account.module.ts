import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { WalletComponent } from './partials/wallet/wallet.component';
import { SettingComponent } from './partials/setting/setting.component';
import { CommandeComponent } from './partials/commande/commande.component';
import { DetailCommandComponent } from './partials/commande/detail-command/detail-command.component';
import { LitigesComponent } from './partials/commande/litiges/litiges.component';
import { AdresseComponent } from './partials/setting/adresse/adresse.component';
import { CompteComponent } from './partials/setting/compte/compte.component';
import { CreditWalletComponent } from './partials/wallet/credit-wallet/credit-wallet.component';
import { TransactionComponent } from './partials/wallet/transaction/transaction.component';
import { TransfertComponent } from './partials/wallet/transfert/transfert.component';
import { AccountTransfertComponent } from './partials/wallet/account-transfert/account-transfert.component';
import { EventTransfertComponent } from './partials/wallet/event-transfert/event-transfert.component';
import { MakeTransfertComponent } from './partials/wallet/make-transfert/make-transfert.component';
import { AmountCreditComponent } from './partials/wallet/credit-wallet/amount-credit/amount-credit.component';
import { CreditByCardComponent } from './partials/wallet/credit-wallet/credit-by-card/credit-by-card.component';
import { AdressBilingComponent } from './partials/setting/adresse/adress-biling/adress-biling.component';
import { AdressDeleveryComponent } from './partials/setting/adresse/adress-delevery/adress-delevery.component';
import { AdressOtherComponent } from './partials/setting/adresse/adress-other/adress-other.component';
import { EditEmailComponent } from './partials/setting/compte/edit-email/edit-email.component';
import { EditPasswordComponent } from './partials/setting/compte/edit-password/edit-password.component';
import { EuropeanAccountComponent } from './partials/wallet/account-transfert/european-account/european-account.component';
import { InternationalAccountComponent } from './partials/wallet/account-transfert/international-account/international-account.component';
import { PaypalAccountComponent } from './partials/wallet/account-transfert/paypal-account/paypal-account.component';
import { WesternunionAccountComponent } from './partials/wallet/account-transfert/westernunion-account/westernunion-account.component';
import { AnountToTransfertComponent } from './partials/wallet/make-transfert/anount-to-transfert/anount-to-transfert.component';
import { PaymentEuropeanComponent } from './partials/wallet/make-transfert/payment-european/payment-european.component';
import { PaymentInternationalComponent } from './partials/wallet/make-transfert/payment-international/payment-international.component';
import { PaymentPaypalComponent } from './partials/wallet/make-transfert/payment-paypal/payment-paypal.component';
import { PaymentWesternunionComponent } from './partials/wallet/make-transfert/payment-westernunion/payment-westernunion.component';
import { SecurityPaymentComponent } from './partials/wallet/make-transfert/security-payment/security-payment.component';
import { MethodPaymentTransfertComponent } from './partials/wallet/make-transfert/method-payment-transfert/method-payment-transfert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
import { AmountToTransfertComponent } from './partials/wallet/make-transfert/amount-to-transfert/amount-to-transfert.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { NgxPayPalModule } from 'ngx-paypal';
import { MatDialogModule } from '@angular/material/dialog';
import { CreditBySavedCardComponent } from './partials/wallet/credit-wallet/credit-by-saved-card/credit-by-saved-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AccountComponent,
    WalletComponent,
    SettingComponent,
    CommandeComponent,
    DetailCommandComponent,
    LitigesComponent,
    AdresseComponent,
    CompteComponent,
    CreditWalletComponent,
    TransactionComponent,
    TransfertComponent,
    AccountTransfertComponent,
    EventTransfertComponent,
    MakeTransfertComponent,
    AmountCreditComponent,
    CreditByCardComponent,
    AdressBilingComponent,
    AdressDeleveryComponent,
    AdressOtherComponent,
    EditEmailComponent,
    EditPasswordComponent,
    EuropeanAccountComponent,
    InternationalAccountComponent,
    PaypalAccountComponent,
    WesternunionAccountComponent,
    AnountToTransfertComponent,
    AmountToTransfertComponent,
    PaymentEuropeanComponent,
    PaymentInternationalComponent,
    PaymentPaypalComponent,
    PaymentWesternunionComponent,
    SecurityPaymentComponent,
    MethodPaymentTransfertComponent,
    CreditBySavedCardComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    TranslateModule,
    TranslateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    NgxPaginationModule,
    NgxIntlTelInputModule,
    MatAutocompleteModule,
    NgxPayPalModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class AccountModule { }
