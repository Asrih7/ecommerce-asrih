import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AlertsService } from 'src/@core/services/alerts.service';
import { WalletService } from 'src/@core/services/wallet.service';
import { DeleteConfirmation } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import _ from 'lodash';

@Component({
  selector: 'app-paypal-account',
  templateUrl: './paypal-account.component.html',
  styleUrls: ['./paypal-account.component.scss']
})
export class PaypalAccountComponent implements OnInit, OnDestroy {
  paypalAccountCurrent: any = [];
  @Input() fieldsPaypalAccount: any = [];
  emptyAccount = false;
  showLoader = false;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public _dialog: MatDialog,
    private _translate: TranslateService,
    private walletService: WalletService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {
    this.getPaypal();
  }

  deleteConfirmation(productId: any, title: any) {
    const dialogRef = this._dialog.open(DeleteConfirmation, {
      data: {
        title: this._translate.instant('delete_confirmation.delete_confirmation_title'),
        content: this._translate.instant('transfer_account.delete_confirmation_content'),
        cancelBtnText: this._translate.instant('delete_confirmation.delete_confirmation_cancel'),
        confirmBtnText: this._translate.instant('delete_confirmation.delete_confirmation_confirm')
      },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.deleteAccount(productId, title)
        }
      });
  }

  deleteAccount(id: any, title: any): any {
    this.walletService.deleteAccountPaypal(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.getPaypal();
        this.alertsService.messageSuccessDelete(title);
      });
  }

  getPaypal(): any {
    this.showLoader = true;
    this.walletService.getAccountPaypal()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.showLoader = false;
        if (response && !_.isEmpty(response)) {
          this.emptyAccount = false;
          this.paypalAccountCurrent = response;
        } else {
          this.emptyAccount = true;
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}