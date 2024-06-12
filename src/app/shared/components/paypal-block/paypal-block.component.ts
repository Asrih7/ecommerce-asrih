import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IPayPalConfig, NgxPaypalComponent } from 'ngx-paypal';
import { lastValueFrom, map } from 'rxjs';
import { WalletService } from 'src/@core/services/wallet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paypal-block',
  templateUrl: './paypal-block.component.html',
  styleUrls: ['./paypal-block.component.scss']
})
export class PaypalBlockComponent implements OnChanges {
  @Input() config: any = {}
  @ViewChild('payPalElem') paypalComponent?: NgxPaypalComponent;
  @Output('sent') SendEmitter: EventEmitter<any> = new EventEmitter<any>();

  public payPalConfig!: IPayPalConfig;

  constructor(
    private walletService: WalletService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']?.currentValue?.currency && changes['config']?.currentValue?.amount) {
      if (!this.payPalConfig) this.initConfig(this.config);
      else this.updateConfig(this.config);
    }
  }

  updateConfig(newValues: any) {
    console.log(newValues)
    const currConfig = newValues;
    const newConfig: IPayPalConfig = {
      ...this.payPalConfig,
      currency: currConfig?.currency ?? 'EUR'
    }

    if (this.paypalComponent) {
      this.paypalComponent.reinitialize(newConfig);
    }
  }

  private initConfig(currConfig?: any): void {
    this.payPalConfig = {
      currency: currConfig?.currency ?? 'EUR',
      createOrderOnServer: (data: any) => {
        console.log(data)
        return lastValueFrom(this.walletService.createPaypalDepositV2().pipe(map((val: any) => {
          return val
        }).bind(this)))
      },
      clientId: environment.paypalKey,
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
      },
      authorizeOnServer: (data, actions) => {
        return lastValueFrom(this.walletService.authorizePaypalPayment({ orderID: data.orderID ?? '' }).pipe(map((val: any) => {
          if (val?.Success === true) {
            this.walletService.getWallet().subscribe();
          }
          this.SendEmitter.emit({
            reset: true
          })
          return val
        }).bind(this)))
      },
      onCancel: (data, actions) => {
        this.walletService.getWallet().subscribe();
      },
      onError: err => {
        this.walletService.getWallet().subscribe();
      },
      onClick: (data, actions) => {
      },
    };
  }
}
