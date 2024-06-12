import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { WalletService } from 'src/@core/services/wallet.service';

@Component({
  selector: 'app-transfert',
  templateUrl: './transfert.component.html',
  styleUrls: ['./transfert.component.scss']
})
export class TransfertComponent implements OnInit, OnDestroy {
  public activeBtn = 'EventTransfer';

  public fieldsPaypalAccount: any = [];
  public fieldsWesternunionAccount: any = [];
  public fieldsEuropeanbankAccount: any = [];
  public fieldsInternationalbankAccount: any = [];
  public westernunionAccount: any;
  public europeanbankAccount: any;
  public internationalbankAccount: any;
  public paypalAccount: any;
  public password: any;
  public transferAmount: any;
  public listFields: any = [];
  public fieldsEventTransfer: any = [];
  
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private walletService: WalletService,
    private settingsService: RegionalSettingsService
  ) { }

  ngOnInit(): void {
    this.getTransfertFields();

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (settings: any) => {
          if (settings?.language) {
            this.getTransfertFields();
          }
        }
      });
  }

  getTransfertFields(): any {
    this.listFields = [];
    this.fieldsPaypalAccount = [];
    this.fieldsWesternunionAccount = [];
    this.fieldsEuropeanbankAccount = [];
    this.fieldsInternationalbankAccount = [];
    this.readControlFields();
  }

  readControlFields(): any {
    this.walletService.getFieldsTransfer()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((fields) => {
        const list = fields.actions.GET;
        for (const [key, value] of Object.entries(list)) {
          this.listFields = [...this.listFields, { key, value }];
        }

        this.fieldsEventTransfer = this.listFields.filter((field: any) =>
          !['content_object', 'id', 'wallet', 'paypal_account', 'western_union_account', 'european_bank_account', 'international_bank_account', 'password', 'transfer_amount_currency'].includes(field.key)
        );

        this.listFields.forEach((element: any) => {
          switch (element.key) {
            case 'transfer_amount':
              this.transferAmount = element;
              break;
            case 'paypal_account':
              this.paypalAccount = element;
              for (const [key, value] of Object.entries(element.value.children)) {
                this.fieldsPaypalAccount = [...this.fieldsPaypalAccount, { key, value }];
              }

              this.fieldsPaypalAccount = this.fieldsPaypalAccount.filter((field: any) => field.key !== 'id');
              break;
            case 'western_union_account':
              this.westernunionAccount = element;
              for (const [key, value] of Object.entries(element.value.children)) {
                this.fieldsWesternunionAccount = [...this.fieldsWesternunionAccount, { key, value }];
              }

              this.fieldsWesternunionAccount = this.fieldsWesternunionAccount.filter((field: any) => field.key !== 'id');
              break;
            case 'european_bank_account':
              this.europeanbankAccount = element;
              for (const [key, value] of Object.entries(element.value.children)) {
                this.fieldsEuropeanbankAccount = [...this.fieldsEuropeanbankAccount, { key, value }];
              }

              this.fieldsEuropeanbankAccount = this.fieldsEuropeanbankAccount.filter((field: any) => field.key !== 'id');
              break;
            case 'international_bank_account':
              this.internationalbankAccount = element;
              for (const [key, value] of Object.entries(element.value.children)) {
                this.fieldsInternationalbankAccount = [...this.fieldsInternationalbankAccount, { key, value }];
              }

              this.fieldsInternationalbankAccount = this.fieldsInternationalbankAccount.filter((field: any) => field.key !== 'id');
              break;
            case 'password':
              this.password = element;
              break;
            default:
              break;
          }
        });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
