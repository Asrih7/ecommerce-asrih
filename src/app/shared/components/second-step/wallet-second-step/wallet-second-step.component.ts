import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGeneric } from 'src/@core/models/form-generic';
import { SHOP_INFOS } from 'src/@core/models/form.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-wallet-second-step',
  templateUrl: './wallet-second-step.component.html',
  styleUrls: ['./wallet-second-step.component.scss']
})
export class WalletSecondStepComponent implements OnInit, OnChanges {
  errs: any = [];
  @Input() currencyErrors: any;
  @Input() currencies: any;
  @Input() defaultCurrency: any;
  @Input() submitFormCheck: any;
  form: FormGeneric = new FormGeneric(this.fb);
  errorObg = {};
  @Output() formWalletShared: EventEmitter<any> = new EventEmitter();
  @Input() listShops: any;
  currencyValue: any;
  currencyList = [];
  searchedCurrency: any = [];
  constructor(private fb: FormBuilder) {
    this.form.group = this.fb.group(SHOP_INFOS);
  }

  ngOnInit(): void {
  }
  searchCurency(event: any) {
    console.log(this.currencyList);

    this.searchedCurrency = this.currencyList.filter((item: any) => item.display_name.toLowerCase().includes(event.target.value.toLowerCase()))
  }
  displayCurrFn(curr?: any): string {
    let value: any;
    if (this.currencyList) {
      value = this.currencyList.find((item: any) => item.value == curr)

    }
    return value ? value.display_name : "";
  }
  ngOnChanges(changes: any): void {
    if (changes.currencies) {
      this.currencyList = changes.currencies.currentValue[0]?.value.choices;
      this.searchedCurrency = changes.currencies.currentValue[0]?.value.choices;
    }
    // if (!_.isEmpty(this.currencyErrors)) {
    //   this.currencyErrors.forEach(element => {
    //     if (element.key === 'currency') {
    //       for (const [key, value] of Object.entries(element.value)) {
    //         this.errs = [...this.errs, { key, value }];
    //       }
    //       this.errs = _.uniqBy(this.errs, 'key');
    //     }
    //   });
    // } else {
    //   this.errs = [];
    // }
  }
  getCurrencyShop(currency: any): any {
    this.currencyValue = currency.option.value;
    this.formWalletShared.emit(this.currencyValue);
  }
}
