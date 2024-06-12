import { Component, Input, OnInit } from '@angular/core';
import _ from 'lodash';
import { PaypalAccount } from 'src/@core/models/paypalAccount';
import { WalletService } from 'src/@core/services/wallet.service';

@Component({
  selector: 'app-payment-paypal',
  templateUrl: './payment-paypal.component.html',
  styleUrls: ['./payment-paypal.component.scss']
})
export class PaymentPaypalComponent implements OnInit {
  @Input() submitGroup: any;
  @Input() fieldsPaypalAccount: any;
  @Input() paypalAccount: any;
  @Input() errorsPaypal: any;
  emptyAccount = false;
  paypalAccountCurrent: any = [];
  selectAccount = {} as PaypalAccount;
  hideAddNewAccount = false;
  id: any;
  constructor(private walletService: WalletService) {
  }

  ngOnInit(): void {
    this.getPaypal();
  }
  getPaypal(): any {
    this.walletService.getAccountPaypal().subscribe(response => {
      if (response && !_.isEmpty(response)) {
        this.emptyAccount = false;
        this.paypalAccountCurrent = response;
      } else {
        this.emptyAccount = true;
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
    this.submitGroup.get('email_paypal').setValue(this.selectAccount.email_paypal);
  }
}
