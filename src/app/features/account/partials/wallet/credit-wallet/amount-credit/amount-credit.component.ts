import { CurrencyPipe } from '@angular/common';
import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isObject, isString } from 'lodash';
import { tap } from 'rxjs';
import { WalletService } from 'src/@core/services/wallet.service';

@Component({
  selector: 'app-amount-credit',
  templateUrl: './amount-credit.component.html',
  styleUrls: ['./amount-credit.component.scss']
})
export class AmountCreditComponent implements AfterViewChecked,OnInit {
  @Output('amount') amountEvent = new EventEmitter<string>();
  @Input('currencyType') currencyType : string = '';
  @Input('value') value : string = '0.00';
  errorMessage : string | null = null;
  errors : any[] = [];
  constructor(private wS : WalletService){

  }
  sendAmount(){
    this.wS.sendDepositAmount({deposit_amount : this.value}).subscribe(
      (val : any)=>{
        console.log(val)
        this.errors = [];
        if(val.deposit_amount && val.id){
          this.amountEvent.emit(val.deposit_amount)
        }
      }
      ,
      err=>{
        this.errors = [];
        console.log(err)
        for (const [key, value] of Object.entries(err.error)) {
          if(Array.isArray(value)){
            value.forEach(ele=>{
              if(isString(ele)) this.errors.push(ele)

            })
          }else if(isObject(value)){
          for(const [innerKey, innerValue] of Object.entries(value))
          {
            if(isString(innerValue)) this.errors.push(innerValue)
          }
          }
        }

      }
    )
  }

  ngAfterViewChecked(): void {   
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && changes['value'].currentValue!=undefined && changes['value'].previousValue==undefined && changes['value'].firstChange) {
      if ((<HTMLInputElement>document.getElementById('deposit_amount')) != null) {
        (<HTMLInputElement>document.getElementById('deposit_amount')).scrollIntoView({
          behavior: 'smooth', block: "end", inline: "end"
        });
      }      
    }
  }
  fieldConfig : any;
  ngOnInit() {
    this.value='0.00'
      this.wS.getFieldsDeposit().pipe(
      ).subscribe(
        val=>{
          console.log(val)
          this.fieldConfig  = val?.actions?.POST?.deposit_amount;
        },
        err=>{
          console.log(err)
        }
        )
  }

}
