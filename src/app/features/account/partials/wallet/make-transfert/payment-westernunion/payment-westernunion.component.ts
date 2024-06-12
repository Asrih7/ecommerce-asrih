import { Component, Input, OnInit } from '@angular/core';
import _ from 'lodash';
import { WesternUnionAccount } from 'src/@core/models/westernUnionAccount';
import { WalletService } from 'src/@core/services/wallet.service';

@Component({
  selector: 'app-payment-westernunion',
  templateUrl: './payment-westernunion.component.html',
  styleUrls: ['./payment-westernunion.component.scss']
})
export class PaymentWesternunionComponent implements OnInit {
  westernUnionAccount = {} as WesternUnionAccount;
  @Input() fieldsWesternunionAccount: any;
  @Input() listCountries: any = [];
  searchedCountry: any = []
  @Input() submitGroup: any;
  @Input() errorsWesternunion: any;
  westernAccountCurrent: any = [];
  emptyAccount = false;
  firstName: any; lastName: any; receivingCity: any; state: any; region: any; country: any;
  // selectAccount = {} as WesternUnionAccount;
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
    this.getWesternUnion();
    this.prepareFileds();
  }
  getWesternUnion(): any {
    this.walletService.getAccountWesternunion().subscribe((response: any) => {
      if (response && !_.isEmpty(response)) {
        this.emptyAccount = false;
        this.westernAccountCurrent = response;
      } else {
        this.emptyAccount = true;
      }
    });
  }
  prepareFileds(): any {
    this.fieldsWesternunionAccount.forEach((element: any) => {
      if (element.key === 'first_name') {
        this.firstName = element.value.label;
      }
      else if (element.key === 'last_name') {
        this.lastName = element.value.label;
      }
      else if (element.key === 'receiving_city') {
        this.receivingCity = element.value.label;
      }
      else if (element.key === 'state') {
        this.state = element.value.label;
      }
      else if (element.key === 'region') {
        this.region = element.value.label;
      }
      else if (element.key === 'country') {
        this.country = element.value.label;
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
    this.hideAddNewAccount = false;
    this.prepareFormData(account);
  }
  prepareFormData(account: any): any {
    this.submitGroup.get('first_name').setValue(account.first_name);
    this.submitGroup.get('last_name').setValue(account.last_name);
    this.submitGroup.get('receiving_city').setValue(account.receiving_city);
    this.submitGroup.get('state').setValue(account.state);
    this.submitGroup.get('region').setValue(account.region);
    this.submitGroup.get('country').setValue(account.country);
  }
}
