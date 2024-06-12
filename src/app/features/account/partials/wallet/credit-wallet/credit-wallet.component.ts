import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WalletService } from 'src/@core/services/wallet.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DeleteConfirmation } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
interface step {
  id: number;
  title: string;
}
@Component({
  selector: 'app-credit-wallet',
  templateUrl: './credit-wallet.component.html',
  styleUrls: ['./credit-wallet.component.scss']
})
export class CreditWalletComponent implements OnInit, OnChanges {
  @Input('wallet') wallet: any = {}
  typePayment = false;
  showPaypal = false;
  creditAmout: string = '0.00';
  showCarte: boolean=false;
  savedCards: any;
  selectedOption:any;
  checkedOption:boolean=false;

  private _unsubscribeAll: Subject<any> = new Subject();
  updateCreditPayment($event: any) {
    this.creditAmout = $event;
    this.currentStep = 1;
    this.updateCurrencyConfig()
  }
  steps: step[] = [
    {
      id: 1,
      title: 'wallet.credit.step_1_title'
    },
    {
      id: 2,
      title: 'wallet.credit.step_2_title'
    },
  ]
  currentStep: number = 0;
  currentStepFromService:number
  paypal_supported_currencies = ['CAD', 'USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CNY', 'DKK', 'MYR',
    'MXN', 'NZD', 'NOK', 'PHP', 'RUB', 'SGD', 'THB', 'SEK', 'CHF',
    'BRL',]
  constructor(private walletService: WalletService, private toaster: ToastrService, private translate: TranslateService,public _dialog: MatDialog) { }
  paypalSupported: boolean = false;
  async ngOnInit(): Promise<void> {  
    this.walletService.getPaymentIntent().subscribe(async (dataPayement:any)=>{
      if(dataPayement){
        this.savedCards=dataPayement.list_payment_methods.data.map((data:any,i:number)=>{
          return {
            id:data.id,
            brand:data.card.brand,
            last4:data.card.last4,
            exp_month:data.card.exp_month,
            exp_year:data.card.exp_year,
            expired:new Date(data.card.exp_year, data.card.exp_month+1)<new Date(),
            checkedOption:i==0
          }
          
        });
        if(this.savedCards){
          this.selectedOption=this.savedCards[0]
          this.checkedOption=true        
        }    
      }
    })  
    this.updateCurrencyConfig()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['wallet'].currentValue?.balance_currency) {
      if (this.wallet.balance_currency && this.paypal_supported_currencies.includes(this.wallet.balance_currency)) {
        this.paypalSupported = true;
        this.showPaypal = false;
      }
    }
  }
  checkPayMode(e: any): any {
    console.log(e)
    if (e === 'paypal') {
      console.log(e)
      this.showPaypal = true;
      this.showCarte=false;
      this.checkedOption=false
    } else if(e==='stripe'){      
      this.showPaypal = false;
      this.showCarte=true;
      this.checkedOption=false
    }else {
      this.selectedOption=e;  
      this.showPaypal = false;
      this.showCarte=false;
      this.checkedOption=true
    }
  }
  creditConfig: any = {}
  updateCurrencyConfig() {
    this.creditConfig = {
      amount: this.creditAmout,
      currency: this.wallet?.balance_currency,
    }
  }

  paypalEvent(e: any) {
    if (e?.reset === true) {
      this.currentStep = 0;
      this.creditAmout = '0.00';
    }
  }
  deleteCard(card:any){
    const dialogRef = this._dialog.open(DeleteConfirmation, {
      data: {
        title: this.translate.instant('delete_confirmation.delete_confirmation_title'),
        content: this.translate.instant('wallet.credit.delete_confirmation_content'),
        cancelBtnText: this.translate.instant('delete_confirmation.delete_confirmation_cancel'),
        confirmBtnText: this.translate.instant('delete_confirmation.delete_confirmation_confirm')
      },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.walletService.deletePaymentCard(card.id).subscribe((data:any)=>{
            console.log('data',data);
            this.toaster.success(this.translate.instant('wallet.credit.successDeltedCard'));
            this.walletService.getPaymentIntent().subscribe(async (dataPayement:any)=>{
              if(dataPayement){
                this.savedCards=dataPayement.list_payment_methods.data.map((data:any,i:number)=>{
                  return {
                    id:data.id,
                    brand:data.card.brand,
                    last4:data.card.last4,
                    exp_month:data.card.exp_month,
                    exp_year:data.card.exp_year,
                    expired:new Date(data.card.exp_year, data.card.exp_month+1)<new Date(),
                    checkedOption:i==0
                  }
                  
                });  
              }
            })  
      
          })
        }
      });
   
  }
  resetCurrentStep() {
    this.currentStep = 0;
    this.showCarte=false;
    this.showPaypal=false;
    this.checkedOption=true;
  }
  changeStep(){
    this.currentStep = 0   
    this.savedCards.forEach((card:any,i:number) => {
      card.checkedOption=i==0
    }); 
    this.showCarte=false;
    this.showPaypal=false;
    this.checkedOption=true;
  }
}
