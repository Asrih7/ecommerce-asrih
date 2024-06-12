import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MaskedDate } from 'src/@core/utils/helpers';
import { Stripe, StripeCardCvcElement, StripeCardElement, StripeCardElementOptions, StripeCardExpiryElement, StripeCardNumberElement, StripeElements } from '@stripe/stripe-js';
import { WalletService } from 'src/@core/services/wallet.service';
import { UserService } from 'src/@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-credit-by-card',
  templateUrl: './credit-by-card.component.html',
  styleUrls: ['./credit-by-card.component.scss']
})
export class CreditByCardComponent implements OnInit {
  @ViewChild('cardElement') cardElement: ElementRef;
  @Input('amout') amout : string = '0.00';
  @Input('currencyType') currencyType : string = '';
  @ViewChild('cardNumberElement') cardNumberElement: ElementRef;
  @ViewChild('cardExpiryElement') cardExpiryElement: ElementRef;
  @ViewChild('cardCvcElement') cardCvcElement: ElementRef;
  
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  elements: StripeElements;
  cardNumber: StripeCardNumberElement;
  cardExpiry: StripeCardExpiryElement;
  cardCvc: StripeCardCvcElement;
  @Output() resetStep: EventEmitter<void> = new EventEmitter<void>();
  @Input() config: any;
  dateMask: any;
  cardNumberError: string | null;
  cardExpiryError: string | null;
  cardCvcError: string | null;
  cardImage: string="assets/img/all-type-card.png";
  languageProfile: string | undefined;
  memorizeBankCard:boolean=false;
  showLoader: boolean=false;
  constructor(private walletService: WalletService,private userService: UserService, private toaster: ToastrService, private translate: TranslateService) { }

  async ngOnInit(): Promise<void> {
    this.userService.profile$
    .subscribe(data => {
      if (data) {
        this.languageProfile = data._language;
      }
    });
    this.dateMask = MaskedDate;
    this.stripe = await this.walletService.stripePromise;
    this.elements = await this.walletService.getStripeElements();
    if (this.stripe) {
      const cardOptions: StripeCardElementOptions = {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
            '::placeholder': {
              color: '#aab7c4'
            }
          }
        }
      };
      this.cardNumber = this.elements.create('cardNumber', cardOptions);
      this.cardNumber.mount(this.cardNumberElement.nativeElement);
      
      this.cardExpiry = this.elements.create('cardExpiry', cardOptions);
      this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
      
      this.cardCvc = this.elements.create('cardCvc', cardOptions);
      this.cardCvc.mount(this.cardCvcElement.nativeElement);
      this.cardNumber.on('change', event => {
        this.cardNumberError = event.error ? event.error.message : null;
        if (event.brand) {
          this.cardImage = this.getCardImage(event.brand);
        }
      });

      this.cardExpiry.on('change', event => {
        this.cardExpiryError = event.error ? event.error.message : null;
      });

      this.cardCvc.on('change', event => {
        this.cardCvcError = event.error ? event.error.message : null;
      });
    } else {
      console.error('Stripe has not been initialized.');
    }
  }
  async onSubmit() {    
    if (!this.stripe || !this.cardNumber) {
      console.error('Stripe or card element is not available.');
      return;
    }
    this.showLoader=true;
    const { paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardNumber
    });
    if (!paymentMethod) {
      this.showLoader=false;
      console.error('Payment method not received.');
      return;
    }
    
    const response = await this.walletService.createPaymentIntent(paymentMethod.id,this.memorizeBankCard);
    response.subscribe((data:any)=>{
      this.showLoader=false;
      this.walletService.getWallet().subscribe();
      if(data){
        this.cardNumber.clear();
        this.cardCvc.clear();
        this.cardExpiry.clear();        
        this.toaster.success(this.translate.instant('wallet.credit.transaction_success'));
        this.resetStep.emit();
      }
      console.log('data payement',data)
    })
    
  }
  getCardImage(brand: string): string {
    switch (brand) {
      case 'visa':
        return 'assets/img/visa.png';
      case 'mastercard':
        return 'assets/img/mastercard.png';
      case 'amex':
        return 'assets/img/amex.png';
      case 'discover':
        return 'assets/img/discover.png';
      default:
        return 'assets/img/all-type-card.png';
    }
  }

}
