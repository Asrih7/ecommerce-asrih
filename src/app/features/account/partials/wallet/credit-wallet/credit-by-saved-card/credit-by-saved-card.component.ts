import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { WalletService } from 'src/@core/services/wallet.service';

@Component({
  selector: 'app-credit-by-saved-card',
  templateUrl: './credit-by-saved-card.component.html',
  styleUrls: ['./credit-by-saved-card.component.scss']
})
export class CreditBySavedCardComponent implements OnInit {
  @Input('amout') amout : string = '0.00';
  @Input('currencyType') currencyType : string = '';
  @Input('card') card : any;
  @Output() resetStep: EventEmitter<void> = new EventEmitter<void>();
  selectedOption:any;
  showError: boolean=false;
  currentStep: any;
  showLoader = false;
  constructor(private walletService: WalletService,private toaster: ToastrService, private translate: TranslateService,private router: Router) { }
  async ngOnInit(): Promise<void> {    
   
  }
  async onSubmit(){ 
    this.showLoader=true
    const response = await this.walletService.createPaymentIntent(this.card.id);
    response.subscribe((data:any)=>{
      this.showLoader=false
      console.log('data payement',data)
      if(data){   
        this.walletService.getWallet().subscribe()     
        this.toaster.success(this.translate.instant('wallet.credit.transaction_success'));
        this.resetStep.emit();
      }
    })
  }   
  
}
