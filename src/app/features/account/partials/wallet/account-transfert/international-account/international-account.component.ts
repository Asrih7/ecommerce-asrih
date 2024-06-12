import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AlertsService } from 'src/@core/services/alerts.service';
import { WalletService } from 'src/@core/services/wallet.service';
import { DeleteConfirmation } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import _ from 'lodash';

@Component({
  selector: 'app-international-account',
  templateUrl: './international-account.component.html',
  styleUrls: ['./international-account.component.scss']
})
export class InternationalAccountComponent implements OnInit {
  @Input() fieldsInternationalbankAccount: any;
  @Input() listCountries: any;
  internationalAccountCurrent: any;
  emptyAccount = false;
  getCurrentCountry: any;
  showLoader = false;
  accountOwner: any; birthDate: any; accountNumber: any; triNumber: any; iban: any; bic: any; bankName: any; bankCity: any; bankCountry: any; accountAddress: any;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public _dialog: MatDialog,
    private _translate: TranslateService,
    private walletService: WalletService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {
    this.getInternationalAccount();
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
    this.walletService.deleteAccountInternational(id).subscribe(response => {
      this.getInternationalAccount();
      this.alertsService.messageSuccessDelete(title);
    });
  }

  getInternationalAccount(): any {
    this.showLoader = true;

    this.walletService.getAccountInternational().subscribe(response => {
      this.showLoader = false;
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
}
