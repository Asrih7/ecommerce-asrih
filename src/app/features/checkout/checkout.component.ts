import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Address } from 'src/@core/models/address';
import { Basket } from 'src/@core/models/basket';
import { Profile } from 'src/@core/models/profile';
import { BasketService } from 'src/@core/services/basket.service';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { UserService } from 'src/@core/services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public currentBasket: Basket | null;
  public profile: Profile | null;
  public loadingBasket = false;
  public totals: any;
  public discount: string = '';
  public discountError: string = '';
  public adressFields: any = [];
  public adressPopinOpened = false;
  public editedAdresse: string;
  public countries: any[] = []
  public useTheSameAddress: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private basketService: BasketService,
    private userService: UserService,
    private fieldsControl: GenerateInformationsService,
    private settingsService: RegionalSettingsService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.getBasket();
    this.getProfile();
    this.getAdresseFields();

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (settings: any) => {
          if (settings?.language) {
            this.getAdresseFields();
          }
        }
      });
  }

  getProfile(): void {
    this.userService.profile$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(profile => {
        if (profile) {
          this.profile = profile;
        }
      });
  }

  getAdresseFields(): any {
    this.adressFields = [];
    this.fieldsControl.getInformationAddress()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (fields: any) => {
          const list = fields.actions.POST;
          for (const [key, value] of Object.entries(list)) {
            if (!['name_ext', 'company_name', 'longitude', 'latitude', 'id'].includes(key) && !(value as any)?.read_only) {
              this.adressFields = [...this.adressFields, { key, value }];
              if (key == 'country') {
                this.countries = (value as any)?.choices ?? [];
              }
            }
          }
          console.log(this.adressFields)
        }
      });
  }

  getBasket(loading: boolean = true) {
    this.loadingBasket = loading;
    this.basketService.getBasket()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: basket => {
            this.loadingBasket = false;
            this.currentBasket = basket;
            this.getBasketTotalAmount();
          },
          error: err => {
            this.loadingBasket = false;
            console.log(err);
          }
        }
      );
  }

  getBasketTotalAmount() {
    this.totals = this.currentBasket?.items?.reduce((sums, a) => {
      return {
        totalUnitPrice: sums.totalUnitPrice + ((a.unit_price ?? 0) * (a.quantity ?? 1)),
        totalPriceAfterPromotion: sums.totalPriceAfterPromotion + ((a.unit_promotional_price ?? (a.unit_price ?? 0)) * (a.quantity ?? 1)),
        totalDiscountAmount: sums.totalDiscountAmount + (a.discount_amount ?? 0) * (a.quantity ?? 1),
        totalShippingCost: sums.totalShippingCost + (a?.shipping_zones_of_customer?.find(s => a.shipping_zone && s.id == a.shipping_zone)?.shipping_amount ?? 0),
        to: !sums.to && a?.shipping_zones_of_customer ? a?.shipping_zones_of_customer[0]?.to_country : sums.to,
      };
    }, { totalUnitPrice: 0, totalPriceAfterPromotion: 0, totalDiscountAmount: 0, totalShippingCost: 0, to: undefined });
  }

  applyDiscountCoupon() {
    if (this.currentBasket) {
      this.currentBasket.discount = this.discount
    }

    this.updateBasket();
  }

  deleteDiscountCoupon() {
    if (this.currentBasket) {
      this.currentBasket.discount = ''
    }

    this.updateBasket();
  }

  updateBasket() {
    this.discountError = '';
    this.basketService.putBasketDiscount(this.currentBasket)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: basket => {
            this.currentBasket = basket;
            this.getBasketTotalAmount();
          },
          error: err => {
            this.discountError = err?.error?.message;
          }
        });
  }

  sameAddressChange(event: any) {
    this.useTheSameAddress = event.target.checked;
  }

  updateAddresse(type: string) {
    this.adressPopinOpened = true;
    this.editedAdresse = type;
  }

  closeUpdateAddress(update: boolean) {
    this.adressPopinOpened = false;
    this.getBasket(false);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
