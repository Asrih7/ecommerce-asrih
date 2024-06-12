import { Component, Input, OnChanges, OnInit } from '@angular/core';
import _ from 'lodash';
import { InternationalBankAccount } from 'src/@core/models/internationalBankAccount';
import { WalletService } from 'src/@core/services/wallet.service';
import { MaskedDate } from 'src/@core/utils/helpers';

@Component({
  selector: 'app-payment-international',
  templateUrl: './payment-international.component.html',
  styleUrls: ['./payment-international.component.scss']
})
export class PaymentInternationalComponent implements OnInit, OnChanges {
  @Input() submitGroup: any;
  @Input() fieldsInternationalbankAccount: any;
  @Input() errorsInternationalaccount: any;
  @Input() listCountries: any = [];
  searchedCountry: any = []
  dateMask: any;
  inputFormatDate: any;
  dateFormat: any;
  valDate: any;
  internationalAccountCurrent: any = [];
  emptyAccount = false;
  getCurrentCountry: any;
  accountOwner: any; birthDate: any; accountNumber: any; triNumber: any; iban: any; bic: any; bankName: any; bankCity: any; bankCountry: any; accountAddress: any;
  selectAccount = {} as InternationalBankAccount;
  hideAddNewAccount = false;
  id: any;
  constructor(private walletService: WalletService) {
  }
  ngOnChanges(changes: any): void {
    if (changes.countryList) {
      this.searchedCountry = this.listCountries
    }
  }
  displayCountFn(count?: any): string {
    let value: any;
    if (this.listCountries) {
      value = this.listCountries.find((item: any) => item.value == count)
    }
    return value ? value.display_name : "";
  }
  searchCountry(event: any) {
    this.searchedCountry = this.listCountries.filter((item: any) => item.display_name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  ngOnInit(): void {
    this.dateMask = MaskedDate;
    this.getInternationalAccount();
    this.prepareFileds();
    // this.submitGroup.birth_date =
    // this.shortDatePipe.transform(this.fb.group(PAYMENT_INTERNATIONAL_FORM).get('birth_date').value, 'yyyy-MM-dd');
    // if (localStorage.getItem('language') === 'en') {
    //   this.localeService.use('en');
    //   this.inputFormatDate = 'YYYY-MM-DD';
    //   this.dateFormat = 'yyyy-MM-dd';
    //   this.valDate = this.datePipe.transform(new Date(this.submitGroup.get('birth_date').value), this.dateFormat);
    //   this.submitGroup.get('birth_date').setValue(this.valDate);
    // } else {
    //   this.localeService.use('fr');
    //   this.inputFormatDate = 'DD-MM-YYYY';
    //   this.dateFormat = 'dd-MM-yyyy';
    //   this.valDate = this.datePipe.transform(new Date(this.submitGroup.get('birth_date').value), this.dateFormat);
    //   this.submitGroup.get('birth_date').setValue(this.valDate);
    // }
  }
  getInternationalAccount(): any {
    this.walletService.getAccountInternational().subscribe(response => {
      if (response && !_.isEmpty(response)) {
        this.emptyAccount = false;
        this.internationalAccountCurrent = response;
      } else {
        this.emptyAccount = true;
      }
    });
  }
  prepareFileds(): any {
    this.fieldsInternationalbankAccount.forEach((element: any) => {
      if (element.key === 'account_owner') {
        this.accountOwner = element.value.label;
      }
      else if (element.key === 'birth_date') {
        this.birthDate = element.value.label;
      }
      else if (element.key === 'account_number') {
        this.accountNumber = element.value.label;
      }
      else if (element.key === 'tri_number') {
        this.triNumber = element.value.label;
      }
      else if (element.key === 'iban') {
        this.iban = element.value.label;
      }
      else if (element.key === 'bic') {
        this.bic = element.value.label;
      }
      else if (element.key === 'bank_name') {
        this.bankName = element.value.label;
      }
      else if (element.key === 'bank_city') {
        this.bankCity = element.value.label;
      }
      else if (element.key === 'bank_country') {
        this.bankCountry = element.value.label;
      }
      else if (element.key === 'account_address') {
        this.accountAddress = element.value.label;
      }
    });
  }
  newAccount(): any {
    this.hideAddNewAccount = true;
    this.id = '';
    this.submitGroup.reset();
  }
  accountSelected(account: any): any {
    this.id = account.id;
    this.selectAccount = account;
    this.hideAddNewAccount = false;
    this.submitGroup.get('account_owner').setValue(this.selectAccount.account_owner);
    this.submitGroup.get('birth_date').setValue(this.selectAccount.birth_date);
    this.submitGroup.get('account_number').setValue(this.selectAccount.account_number);
    this.submitGroup.get('tri_number').setValue(this.selectAccount.tri_number);
    this.submitGroup.get('iban').setValue(this.selectAccount.iban);
    this.submitGroup.get('bic').setValue(this.selectAccount.bic);
    this.submitGroup.get('bank_name').setValue(this.selectAccount.bank_name);
    this.submitGroup.get('bank_city').setValue(this.selectAccount.bank_city);
    this.submitGroup.get('bank_country').setValue(this.selectAccount.bank_country);
    this.submitGroup.get('account_address').setValue(this.selectAccount.account_address);
  }
}