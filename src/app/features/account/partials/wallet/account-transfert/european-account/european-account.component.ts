import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { AlertsService } from 'src/@core/services/alerts.service';
import { WalletService } from 'src/@core/services/wallet.service';
import { DeleteConfirmation } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-european-account',
  templateUrl: './european-account.component.html',
  styleUrls: ['./european-account.component.scss']
})
export class EuropeanAccountComponent implements OnInit {
  @Input() fieldsEuropeanbankAccount: any;
  @Input() listCountries: any;

  europeanAccountCurrent: any;
  emptyAccount = false;
  showLoader = false;
  accountOwner: any; iban: any; bic: any; bankName: any; bankCity: any; bankCountry: any;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public _dialog: MatDialog,
    private _translate: TranslateService,
    private walletService: WalletService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {
    this.getAccountEuropean();
    this.prepareFileds();
  }

  deleteConfirmation(id: string, title: any) {
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
    this.walletService.deleteAccountEuropean(id).subscribe(response => {
      this.getAccountEuropean();
      this.alertsService.messageSuccessDelete(title);
    });
  }

  getAccountEuropean(): any {
    this.showLoader = true
    this.walletService.getAccountEuropean().subscribe(response => {
      this.showLoader = false;
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
}
