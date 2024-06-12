import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { WalletService } from 'src/@core/services/wallet.service';

@Component({
  selector: 'app-event-transfert',
  templateUrl: './event-transfert.component.html',
  styleUrls: ['./event-transfert.component.scss']
})
export class EventTransfertComponent implements OnInit, OnDestroy {
  @Input() fieldsEventTransfer: any;

  public transfers: any = [];
  public p2: any;
  public formatDate: any;
  public showLoader = false;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private walletService: WalletService,
    private settingsService: RegionalSettingsService,
  ) { }

  ngOnInit(): void {
    this.initializePagination();
    this.getWalletTransfers();

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (settings: any) => {
          if (settings?.language) {
            this.setDatesFormat();
          }
        }
      });
  }

  setDatesFormat(): any {
    if (localStorage.getItem('language') === 'fr') {
      this.formatDate = 'dd-MM-yyyy';
    } else {
      this.formatDate = 'yyyy-MM-dd';
    }
  }

  initializePagination(): any {
    this.p2 = 0;
  }

  getWalletTransfers(): any {
    this.showLoader = true;
    this.walletService.getTransfer()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: data => {
          this.showLoader = false;
          if (data) {
            this.transfers = data;
          }
        },
        error: err => {
          this.showLoader = false;
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
