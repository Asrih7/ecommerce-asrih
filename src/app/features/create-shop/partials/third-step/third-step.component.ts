import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/@core/services/auth.service';
import { ShopService } from 'src/@core/services/shop.service';
import { WalletService } from 'src/@core/services/wallet.service';
import { scrollTop0 } from 'src/@core/utils/helpers';

@Component({
  selector: 'app-third-step',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.scss']
})
export class ThirdStepComponent implements OnChanges {
  @Input() infosShop: any;
  @Input() currency: any;
  @Output() accessThirdStep: EventEmitter<number> = new EventEmitter();
  @Output() previous: EventEmitter<string> = new EventEmitter();

  createWallet: any;
  listofshops = [];

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private shopService: ShopService,
    private toaster: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnChanges(changes: any): void {
    if (changes.infosShop) {
      this.infosShop = changes.infosShop.currentValue;
    }
  }

  previousStep(): any {
    this.previous.emit();
  }

  validateshop(): any {
    this.spinner.show();
    if (this.currency) {
      this.createWallet = {
        currency: this.currency,

      };
      this.walletService.createWallet(this.createWallet).subscribe();
    }

    if (this.infosShop) {
      this.shopService.createShop(this.infosShop).subscribe(data => {
        if (data) {
          this.toaster.success(this.translate.instant('boutique.validate_shop'));
          this.accessThirdStep.emit(3);
          this.router.navigate(['/shop/update-shop/', data.name]);
          scrollTop0();
          this.spinner.hide();
          this.getShopUser();
        }
      }, err => {
        console.log('err', err);
        this.spinner.hide();
      });
    }
  }

  getShopUser(): void {
    const id = this.authService.getIdOfConnectedUser() || "";
    this.shopService.getListShops('', (id).toString(), '', '', '', '').subscribe((data): any => {
      if (data) {
        this.listofshops = data as any;
      }
    },
      (error) => {
        console.log(error)
      });
  }
}