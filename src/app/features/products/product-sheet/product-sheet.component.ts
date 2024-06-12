import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject, takeUntil } from 'rxjs';
import { AlertsService } from 'src/@core/services/alerts.service';
import { BasketService } from 'src/@core/services/basket.service';
import { ProductService } from 'src/@core/services/product.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-sheet',
  templateUrl: './product-sheet.component.html',
  styleUrls: ['./product-sheet.component.scss']
})
export class ProductSheetComponent implements OnInit, OnDestroy {
  @ViewChild('galleryImgs', { static: false }) galleryImgs: any;

  public product: any;
  public activeSlideIndex = 0;
  public backData: any;
  public shippingFields: any[];
  public countries: any[];
  public productAttrs: any = {};
  public productAttrsKeys: any[] = [];
  public commonProductAttrs: any[] = [];
  public inventotyPrice: any;
  public unexistingComb = false;
  public quantity: number = 1;
  public customisation: string;
  public errors: any;
  public defaultAttrsVals: any;
  public slugId: string;
  public variantQuery: string;

  private _unsubscribeAll: Subject<any> = new Subject();

  public customOptions: OwlOptions = {
    items: 1,
    rewind: true,
    responsiveRefreshRate: 0,
    nav: true,
    navText: [
      '<i class="fal fa-angle-left"></i>',
      '<i class="fal fa-angle-right"></i>'
    ]
  }

  constructor(
    private routerActive: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private basketService: BasketService,
    private alertsService: AlertsService,
    private settingsService: RegionalSettingsService,
    public translate: TranslateService,
    private location: Location,
    private serializer: UrlSerializer

  ) { }

  @HostListener('window:resize')
  onResize() {
    this.galleryImgs.carouselService.onResize(this.galleryImgs.el.nativeElement.offsetWidth);
  }

  ngOnInit() {
    this.backData = history?.state?.backData
    this.slugId = this.routerActive.snapshot.params["slug-id"];
    this.variantQuery = this.routerActive.snapshot.params["query"];
    const id: any = this.slugId.split('-').pop();

    this.getProduct(id);
    this.getInformationsProduct(id);

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: settings => {
          if (settings?.language || settings?.currency) {
            this.getProduct(id);
            this.getInformationsProduct(id);
          }
        }
      });
  }

  getProduct(id: number) {
    this.unexistingComb = false;

    this.productService.getProductById(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: product => {
          this.product = product;
          if (!this.variantQuery) {
            this.inventotyPrice = this.product?.inventory.sort((a: any, b: any) => a.default_price - b.default_price)[0];
          } else {
            this.defaultAttrsVals = {};
            const combination = (this.variantQuery.split('&') ?? []).map((qp: string) => {
              const param = qp.split('=');
              const val = param[1].split('_');
              this.defaultAttrsVals[param[0]] = Number(val[1]);
              return param[1];
            });

            this.inventotyPrice = this.product.inventory.find((i: any) => i.combination.sort().join('/') == combination.sort().join('/'));
            if (!this.inventotyPrice) {
              this.inventotyPrice = this.product?.inventory.sort((a: any, b: any) => a.default_price - b.default_price)[0];
            }
          }

          this.getProductAttributes(product);
          this.setDefalutAttrs();
        },
        error: error => { console.log(error); }
      });
  }

  setDefalutAttrs() {
    this.defaultAttrsVals = {};
    let query = '';
    this.productAttrsKeys.forEach((key: any) => {
      if (this.productAttrs[key].length > 1) {
        const attr = this.productAttrs[key].find((p: any) => this.inventotyPrice?.combination.includes(p.id));
        if (attr) {
          this.defaultAttrsVals[key] = attr.id;
          query += `${!query ? '' : '&'}${key}=${attr.value}_${attr.id}`
        }
      }
    });

    if (query) {
      const urlTree = this.router.createUrlTree([`products/view/${this.slugId}`, query ? { query } : {}]);
      this.location.replaceState(this.serializer.serialize(urlTree));
    }
  }

  getInformationsProduct(id: number) {
    this.productService.getInformationsProduct(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (fields: any) => {
          const getObj = fields?.actions?.GET;
          const zones = getObj?.shipping_profiles?.child?.children['zones'];
          this.countries = getObj?.inspiration_country?.child?.choices;
          this.shippingFields = [];
          for (const [key, value] of Object.entries(zones?.child?.children ?? {})) {
            this.shippingFields = [...this.shippingFields ?? [], { key, value }];
          }
        },
        error: error => { console.log(error); }
      });
  }

  getcountryName(countries: any[], country: string) {
    return countries.find(c => c.value == country)?.display_name
  }

  getProductAttributes(product: any) {
    this.productAttrs = product.product_attributes.reduce((previous: any, currentItem: any) => {
      const group = currentItem.attribute_name;
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    }, {});

    this.productAttrsKeys = Object.keys(this.productAttrs);
    this.commonProductAttrs = Object.values(this.productAttrs).filter((v: any) => v.length == 1);
  }

  attrChange(value: number, key: string) {
    this.defaultAttrsVals[key] = value ?? undefined;
    const combination = [...Object.values(this.defaultAttrsVals)];

    if (combination.length != (this.productAttrsKeys.length - this.commonProductAttrs.length)) {
      return;
    }

    const invComb = this.product.inventory.find((i: any) => i.combination.sort().join('/') == combination.sort().join('/'));

    if (invComb) {
      this.unexistingComb = false;
      this.inventotyPrice = invComb;
      this.setDefalutAttrs();
    } else {
      this.unexistingComb = true;
    }
  }

  setGalleryImg(id: string) {
    this.galleryImgs.to(id);
  }

  slideChanged(activeSlideIdx: number | undefined) {
    if (activeSlideIdx != undefined) {
      this.activeSlideIndex = activeSlideIdx
    }
  }

  returnToProducts() {
    if (!this.backData.backUrl)
      return;

    if (this.backData.query) {
      this.router.navigate([this.backData.backUrl, { query: this.backData.query }], { state: { backData: this.backData } });
    } else {
      this.router.navigate([this.backData.backUrl], { state: { backData: this.backData } });
    }
  }

  addToBasket() {
    const variant = {
      variant: this.inventotyPrice?.id,
      quantity: this.quantity ?? 0,
      customization_content: this.customisation ?? ''
    };

    this.errors = undefined;

    this.basketService.postBasketItem(variant)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: item => {
          this.alertsService.messageSuccess(this.translate.instant('Le produit a été ajouté avec succès'));
          this.customisation = '';
          this.quantity = 1;

          this.basketService.getBasket().subscribe({
            next: basket => { console.log(basket); },
            error: err => { console.log(err); }
          });
        },
        error: err => {
          this.errors = err.error;
          console.log(this.errors);
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
