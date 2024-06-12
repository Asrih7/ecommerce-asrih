import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { AlertsService } from 'src/@core/services/alerts.service';
import { WalletService } from 'src/@core/services/wallet.service';
import { DeleteConfirmation } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-westernunion-account',
  templateUrl: './westernunion-account.component.html',
  styleUrls: ['./westernunion-account.component.scss']
})
export class WesternunionAccountComponent implements OnInit {
  @Input() fieldsWesternunionAccount: any;
  @Input() listCountries: any = [];
  westernAccountCurrent: any = [];
  emptyAccount = false;
  showLoader = false;
  firstName: any; lastName: any; receivingCity: any; state: any; region: any; country: any;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public _dialog: MatDialog,
    private _translate: TranslateService,
    private walletService: WalletService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {
    this.getWesternUnion();
    this.prepareFileds();
  }

  deleteConfirmation(id: any, title: any) {
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
          this.deleteAccount(id, title)
        }
      });
  }

  deleteAccount(id: any, title: any): any {
    this.walletService.deleteAccountWesternunion(id).subscribe(response => {
      this.getWesternUnion();
      this.alertsService.messageSuccessDelete(title);
    });
  }
  getWesternUnion(): any {
    this.showLoader = true;
    this.walletService.getAccountWesternunion().subscribe(response => {
      this.showLoader = false;
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
}
