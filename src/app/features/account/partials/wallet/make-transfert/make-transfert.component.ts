import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import _ from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { FormGeneric } from 'src/@core/models/form-generic';
import { TRANSFER_FORM, PAYMENT_EUROPEAN_FORM, PAYMENT_INTERNATIONAL_FORM, PAYMENT_PAYPAL_FORM, PAYMENT_WESTERNUNION_FORM } from 'src/@core/models/form.model';
import { Transfer } from 'src/@core/models/transfer';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { WalletService } from 'src/@core/services/wallet.service';
import { scrollTop0 } from 'src/@core/utils/helpers';
import { ShortDatePipe } from 'src/app/shared/pipes/short-date.pipe';

@Component({
  selector: 'app-make-transfert',
  templateUrl: './make-transfert.component.html',
  styleUrls: ['./make-transfert.component.scss']
})
export class MakeTransfertComponent implements OnInit {
  @Input() fieldsPaypalAccount: any;
  @Input() fieldsWesternunionAccount: any;
  @Input() fieldsEuropeanbankAccount: any;
  @Input() fieldsInternationalbankAccount: any;
  @Input() password: any;
  @Input() transferAmount: any;

  showPaymentEuropean = false;
  showPaymentInternational = false;
  showPaymentPaypal = false;
  showPaymentWesternunion = false;
  errorMessage = null;
  amount: any;
  typePayment: any;
  form: FormGeneric = new FormGeneric(this.fb);
  transfer: any = {} as Transfer;
  submitGroup: any;
  formGroup: any;
  listFields: any = [];
  passwordValue: any;
  westernunionAccount: any;
  europeanbankAccount: any;
  internationalbankAccount: any;
  paypalAccount: any;
  listCountries: any = [];
  errors: any = [];
  errorsPaypal: any = [];
  errorsPassword: any = [];
  errorsWesternunion: any = [];
  errorsInternationalaccount: any = [];
  errorsEuropeanaccount: any = [];
  errorsTransferAmount: any = [];
  errorsTransferType: any = [];
  otherErrors: any = [];
  enableMsgError = false;
  enableMsgPermission = false;
  resetPaymentChoose = false;
  emptyPassword = '';
  isLoader = false;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private settingsService: RegionalSettingsService,
    private shortDatePipe: ShortDatePipe
  ) {
    this.form.group = this.fb.group(TRANSFER_FORM);
    this.formGroup = this.form.group;
  }

  ngOnInit(): void {
    this.settingsService.listCountries$.subscribe(response => {
      if (response) {
        this.listCountries = response;
      }
    });
  }

  methodPayment(typePayment: any): any {
    this.showPaymentEuropean = false;
    this.showPaymentInternational = false;
    this.showPaymentPaypal = false;
    this.showPaymentWesternunion = false;
    this.typePayment = typePayment;
    this.submitGroup = new FormGroup({});
    switch (typePayment) {
      case 'EB':
        this.showPaymentEuropean = true;
        this.submitGroup = this.fb.group(PAYMENT_EUROPEAN_FORM);
        break;
      case 'IB':
        this.showPaymentInternational = true;
        this.submitGroup = this.fb.group(PAYMENT_INTERNATIONAL_FORM);
        break;
      case 'PP':
        this.showPaymentPaypal = true;
        this.submitGroup = this.fb.group(PAYMENT_PAYPAL_FORM);
        break;
      case 'WU':
        this.showPaymentWesternunion = true;
        this.submitGroup = this.fb.group(PAYMENT_WESTERNUNION_FORM);
        break;
    }
  }

  amountTransferValue(amount: any): any {
    this.amount = amount;
  }

  passwordhandler(val: any): any {
    this.passwordValue = val;
  }

  submitTransfer(): any {
    this.enableMsgError = false;
    this.resetPaymentChoose = false;
    this.enableMsgPermission = false;
    this.errors = [];
    this.errorsPassword = [];
    this.errorsPaypal = [];
    this.errorsEuropeanaccount = [];
    this.errorsInternationalaccount = [];
    this.errorsTransferAmount = [];
    this.errorsTransferType = [];
    this.otherErrors = [];
    this.errorsWesternunion = [];
    this.setValueSubmit();
    this.isLoader = true;

    if (this.typePayment === 'IB') {
      this.submitGroup.value.birth_date = this.shortDatePipe.transform(this.submitGroup.value.birth_date, 'yyyy-MM-dd');
    }

    this.walletService.createTransfer(this.transfer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: response => {
            this.walletService.getWallet().subscribe();
            this.errorMessage = null;
            scrollTop0();
            if (response) {
              this.isLoader = false;
              this.resetPaymentChoose = true;
              this.clearForm();
            }
          },
          error: (err) => {
            this.errorMessage = null
            this.isLoader = false;

            if (err.status === 400) {
              this.enableMsgError = true;

              // this.clearForm();
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }];
              }
              this.errors.forEach((error: any) => {
                if (error.key === 'transfer_amount') {
                  scrollTop0();
                  for (const [key, value] of Object.entries(error.value)) {
                    this.errorsTransferAmount = [...this.errorsTransferAmount, { key, value }];
                  }
                }
                else if (error.key === 'european_bank_account') {
                  for (const [key, value] of Object.entries(error.value)) {
                    this.errorsEuropeanaccount = [...this.errorsEuropeanaccount, { key, value }];
                  }
                }
                else if (error.key === 'international_bank_account') {
                  for (const [key, value] of Object.entries(error.value)) {
                    this.errorsInternationalaccount = [...this.errorsInternationalaccount, { key, value }];
                  }
                }
                else if (error.key === 'paypal_account') {
                  for (const [key, value] of Object.entries(error.value)) {
                    this.errorsPaypal = [...this.errorsPaypal, { key, value }];
                  }
                }
                else if (error.key === 'western_union_account') {
                  for (const [key, value] of Object.entries(error.value)) {
                    this.errorsWesternunion = [...this.errorsWesternunion, { key, value }];
                  }
                }
                else if (error.key === 'password' || error.key === 'current_password') {
                  for (const [key, value] of Object.entries(error.value)) {
                    this.errorsPassword = [...this.errorsPassword, { key, value }];
                  }
                }
                else if (error.key === 'transfer_type') {
                  for (const [key, value] of Object.entries(error.value)) {
                    this.errorsTransferType = [...this.errorsTransferType, { key, value }];
                  }
                }
              });
              if (err.error && err.error.message) {
                scrollTop0();
                this.errorMessage = err.error.message["message"]
              }
              else {
                // scrollTop();
              }
            } else if (err.status === 403) {
              this.enableMsgPermission = true;
              for (const [key, value] of Object.entries(err.error)) {
                this.otherErrors = [...this.otherErrors, { key, value }];
              }
              scrollTop0();
            }
          }
        });
  }

  setValueSubmit(): any {
    this.transfer = {
      transfer_amount: this.amount,
      password: this.passwordValue
    };

    if (this.typePayment === 'EB') {
      this.transfer = {
        transfer_amount: this.amount,
        password: this.passwordValue,
        transfer_type: this.typePayment,
        european_bank_account: this.submitGroup.value,
      };
    } else if (this.typePayment === 'IB') {
      this.transfer = {
        transfer_amount: this.amount,
        password: this.passwordValue,
        transfer_type: this.typePayment,
        international_bank_account: this.submitGroup.value,
      };
    } else if (this.typePayment === 'PP') {
      this.transfer = {
        transfer_amount: this.amount,
        password: this.passwordValue,
        transfer_type: this.typePayment,
        paypal_account: this.submitGroup.value,
      };
    } else if (this.typePayment === 'WU') {
      this.transfer = {
        transfer_amount: this.amount,
        password: this.passwordValue,
        transfer_type: this.typePayment,
        western_union_account: this.submitGroup.value,
      };
    }
  }

  clearForm(): any {
    if (this.submitGroup && this.submitGroup !== undefined) {
      this.submitGroup.reset();
    }

    this.form.group.reset({ password: this.passwordValue });
    this.formGroup.reset({ password: this.passwordValue });
    delete this.amount;
    delete this.typePayment;
    delete this.transfer;
    this.showPaymentEuropean = false;
    this.showPaymentInternational = false;
    this.showPaymentPaypal = false;
    this.showPaymentWesternunion = false;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
