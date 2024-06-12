import { Component, Input, OnInit } from '@angular/core';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { WalletService } from 'src/@core/services/wallet.service';

@Component({
  selector: 'app-account-transfert',
  templateUrl: './account-transfert.component.html',
  styleUrls: ['./account-transfert.component.scss']
})
export class AccountTransfertComponent implements OnInit {
  @Input() fieldsPaypalAccount: any;
  @Input() fieldsWesternunionAccount: any;
  @Input() fieldsEuropeanbankAccount: any;
  @Input() fieldsInternationalbankAccount: any;

  europeanAccount: any = [];
  internationalAccount: any = [];
  paypalAccount: any = [];
  westernunionAccount: any = [];
  listCountries: any = [];

  constructor(
    private walletService: WalletService,
    private settingsService: RegionalSettingsService,
  ) { }

  ngOnInit(): void {
    this.getTransferWallet();
    this.settingsService.listCountries$.subscribe(data => {
      if (data) {
        this.listCountries = data;
      }
    });
  }

  getTransferWallet(): any {
    this.walletService.getTransfer().subscribe(response => {
      if (response) {
        response.forEach((element: any) => {
          if (element.transfer_type === 'EB') {
            this.europeanAccount.push(element);
          } else if (element.transfer_type === 'IB') {
            this.internationalAccount.push(element);
          } else if (element.transfer_type === 'PP') {
            this.paypalAccount.push(element);
          } else if (element.transfer_type === 'WU') {
            this.westernunionAccount.push(element);
          }
        });
      }
    });
  }
}
