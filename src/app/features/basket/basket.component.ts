import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Basket } from 'src/@core/models/basket';
import { AuthService } from 'src/@core/services/auth.service';
import { BasketService } from 'src/@core/services/basket.service';
import { MessagesService } from 'src/@core/services/messages.service';
import { WishlistService } from 'src/@core/services/wishlist.service';
import { LoginOrRegisterComponent } from 'src/app/layout/header/login-or-register/login-or-register.component';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit, OnDestroy {
  public currentBasket: Basket | null;
  public basketItems: any[];
  public totals: any;
  public error: string;
  public loadingBasket = false;
  public wishlistEvent: any;
  public basketPopinOpened = false;
  public editedBasketItem: any;
  public editedBasketItemOigin: any;
  public editedBasketItemError: any;
  public countries: any[] = []
  public shippingZoneError = false;

  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private basketService: BasketService,
    private messagesService: MessagesService,
    private router: Router,
    private auth: AuthService,
    private wishlistService: WishlistService,
    private toaster: ToastrService,
    private translate: TranslateService,
    private modalService: NgbModal,
  ) { }


  ngOnInit() {
    this.auth.userTokens$.subscribe({
      next: tokens => {
        this.getBasket();
      }
    });
  }

  getBasket() {
    this.loadingBasket = true;
    this.basketService.getBasket()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: basket => {
            this.loadingBasket = false;
            this.currentBasket = basket;
            this.setItemsByShop();
            this.getBasketTotalAmount();
          },
          error: err => {
            this.loadingBasket = false;
            console.log(err);
          }
        }
      );
  }

  setItemsByShop() {
    this.basketItems = this.currentBasket?.items?.reduce((group: any, item: any) => {
      if (item.shop_name) {
        group[item.shop_name] = group[item.shop_name] ?? [];
        group[item.shop_name].push(item);
      }

      if (!item.shipping_zone) {
        item.shipping_zone = item?.shipping_zones_of_customer[0].id
      }

      return group;
    }, {});
  }

  getBasketTotalAmount() {
    this.totals = this.currentBasket?.items?.reduce((sums, a) => {
      return {
        totalUnitPrice: sums.totalUnitPrice + ((a.unit_price ?? 0) * (a.quantity ?? 1)),
        totalPriceAfterPromotion: sums.totalPriceAfterPromotion + ((a.unit_promotional_price ?? (a.unit_price ?? 0)) * (a.quantity ?? 1)),
        totalShippingCost: sums.totalShippingCost + (a?.shipping_zones_of_customer?.find(s => a.shipping_zone && s.id == a.shipping_zone)?.shipping_amount ?? 0),
        to: !sums.to && a?.shipping_zones_of_customer ? a?.shipping_zones_of_customer[0]?.to_country : sums.to,
      };
    }, { totalUnitPrice: 0, totalPriceAfterPromotion: 0, totalShippingCost: 0, to: undefined });
  }

  updateBasket() {
    this.error = '';
    this.basketService.putBasketDiscount(this.currentBasket)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: basket => {
            this.updateBasketSuccess(basket);
          },
          error: err => {
            this.error = err?.error?.message;
            console.log(this.error);
          }
        });
  }

  updateBasketSuccess(basket: any) {
    this.currentBasket = basket;
    this.setItemsByShop();
    this.getBasketTotalAmount();
    this.basketService.setBasket(basket);
    this.toaster.success(this.translate.instant('basket.update_basket_msg'));
  }

  deleteBasketIem(item: any) {
    if (this.currentBasket) {
      this.currentBasket.items = this.currentBasket?.items?.filter(bi => bi != item);
    }

    this.updateBasket();
  }

  setAsideBasketIem(item: any) {
    const isConnected = this.auth.isAuthenticated();
    if (!isConnected) {
      this.modalService.open(LoginOrRegisterComponent, { size: 'xs', windowClass: 'modal-login' });
      return;
    }

    this.wishlistService.addProductToWishlist(item.product)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => { this.toaster.success(this.translate.instant('wishlist.add_article_msg')); },
        error: error => { console.log(error); }
      });
  }

  updateBasketItem(item: any) {
    if (this.currentBasket?.items?.length) {
      this.editedBasketItemError = undefined;
      const indOfEditedItem = this.currentBasket.items.map(t => t.variant).indexOf(this.editedBasketItemOigin.variant);
      this.currentBasket.items[indOfEditedItem] = item;
      this.basketService.putBasketDiscount(this.currentBasket)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          {
            next: basket => {
              this.updateBasketSuccess(basket);
              this.basketPopinOpened = false;
            },
            error: err => {
              this.editedBasketItemError = err?.error;
              console.log(this.editedBasketItemError);
            }
          });
    }
  }

  openUpdateBasketPopin(item: any) {
    this.basketPopinOpened = true;
    this.editedBasketItemError = '';
    this.editedBasketItemOigin = JSON.parse(JSON.stringify(item));
    this.editedBasketItem = JSON.parse(JSON.stringify(item));
  }

  viewProduct(item: any, event: any) {
    if (event.ctrlKey) {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/products/view', `${item.product_slug}-${item.product}`]));
      window.open(url, '_blank');
    } else {
      const backData = { backUrl: this.router.url.split(';')[0] }
      this.router.navigate(['/products/view', `${item.product_slug}-${item.product}`], { state: { backData } });
    }
  }

  openConactModal(grp: any) {
    const isConnected = this.auth.isAuthenticated();
    if (isConnected) {
      this.messagesService.openContactModal(grp?.value[0].shop_owner ?? null);
    } else {
      this.modalService.open(LoginOrRegisterComponent, { size: 'xs', windowClass: 'modal-login' });
    }
  }

  checkout(event: any) {
    this.shippingZoneError = false;

    if (this.currentBasket?.items?.find(x => !x.shipping_zone)) {
      this.shippingZoneError = true;
      return;
    }

    this.basketService.putBasketDiscount(this.currentBasket)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: basket => {
            console.log(basket);
            if (event.ctrlKey) {
              const url = this.router.serializeUrl(this.router.createUrlTree(['/checkout']));
              window.open(url, '_blank');
            } else {
              this.router.navigate(['/checkout']);
            }
          },
          error: err => {
            console.log(err);
          }
        });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
