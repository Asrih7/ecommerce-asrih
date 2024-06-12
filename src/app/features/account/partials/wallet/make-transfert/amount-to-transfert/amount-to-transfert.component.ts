import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Wallet } from 'src/@core/models/wallet';
import { WalletService } from 'src/@core/services/wallet.service';
import { ReplaceDot, AddToPrice } from 'src/@core/utils/helpers';

@Component({
  selector: 'app-amount-to-transfert',
  templateUrl: './amount-to-transfert.component.html',
  styleUrls: ['./amount-to-transfert.component.scss']
})
export class AmountToTransfertComponent implements OnInit {
  @Input() transferAmount: any;
  @Input() errorsTransferAmount: any;
  @Input() formGroup: any;
  @Output() amountTransferValue: EventEmitter<any> = new EventEmitter();

  wallet: Wallet | null;
  replaceDot: any;
  addToPrice: any;

  constructor(
    private walletService: WalletService,
  ) { }

  ngOnInit(): void {
    this.replaceDot = ReplaceDot;
    this.addToPrice = AddToPrice;

    this.walletService.walet$.subscribe(data => {
      this.wallet = data;
    });
  }

  getAmount(e: any): any {
    this.amountTransferValue.emit(e.target.value);
  }
}
