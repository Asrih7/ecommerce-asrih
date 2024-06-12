import { Component, Input, OnChanges, OnInit } from '@angular/core';
import _ from 'lodash';
import { EuropeanBankAccount } from 'src/@core/models/europeanBankAccount';
import { WalletService } from 'src/@core/services/wallet.service';

@Component({
  selector: 'app-payment-european',
  templateUrl: './payment-european.component.html',
  styleUrls: ['./payment-european.component.scss']
})
export class PaymentEuropeanComponent implements OnInit, OnChanges {
  @Input() submitGroup: any;
  @Input() fieldsEuropeanbankAccount: any;
  @Input() errorsEuropeanaccount: any;
  @Input() listCountries: any = [];
  europeanAccountCurrent: any = [];
  searchedCountry: any = []
  emptyAccount = false;
  accountOwner: any; iban: any; bic: any; bankName: any; bankCity: any; bankCountry: any;
  selectAccount = {} as EuropeanBankAccount;
  hideAddNewAccount = false;
  id: any;
  constructor(private walletService: WalletService) { }
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
    this.getAccountEuropean();
    this.prepareFileds();
  }
  getAccountEuropean(): any {
    this.walletService.getAccountEuropean().subscribe(response => {
      if (response && !_.isEmpty(response)) {
        this.emptyAccount = false;
        this.europeanAccountCurrent = response;
      } else {
        this.emptyAccount = true;
      }
    });
  }
  prepareFileds(): any {
    this.fieldsEuropeanbankAccount.forEach((element: any) => {
      if (element.key === 'account_owner') {
        this.accountOwner = element.value.label;
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
    this.submitGroup.get('iban').setValue(this.selectAccount.iban);
    this.submitGroup.get('bic').setValue(this.selectAccount.bic);
    this.submitGroup.get('bank_name').setValue(this.selectAccount.bank_name);
    this.submitGroup.get('bank_city').setValue(this.selectAccount.bank_city);
    this.submitGroup.get('bank_country').setValue(this.selectAccount.bank_country);
  }
}
