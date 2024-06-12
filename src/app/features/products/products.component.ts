import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, filter, takeUntil } from 'rxjs';
import { ProductService } from 'src/@core/services/product.service';
import { WishlistService } from 'src/@core/services/wishlist.service';
import { ViewportScroller } from '@angular/common';
import { AuthService } from 'src/@core/services/auth.service';
import { LoginOrRegisterComponent } from 'src/app/layout/header/login-or-register/login-or-register.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  public productsList: any[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 40;
  public totalItems: number = 0;
  public pageSizeOptions: number[] = [40, 80, 120, 240];
  public loadingProducts: boolean = false;
  public activeUrl = '';
  public scrollPosition: [number, number] | undefined;
  public showSearchModal = false;
  public productsSub: Subscription;
  //Filter
  public filters: any;
  public activeFilters: any[];
  public excludedKeys = ['category_hierarchy', 'price', 'inspiration_country'];
  public dynamicFiltersKeys: string[] = [];
  public filterParams: any = {};
  public filteringProducts = false;
  public loadingProductsInformations = false;
  public wishlistEvent: any;
  public authInitsub = true;
  public currency = '';

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public translate: TranslateService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private settingsService: RegionalSettingsService,
    private toaster: ToastrService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private ref: ChangeDetectorRef,
    public auth: AuthService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const backData = history.state?.backData;
    this.scrollPosition = backData?.scrollPosition;
    this.currentPage = backData?.currentPage ?? this.currentPage;
    this.itemsPerPage = backData?.itemsPerPage ?? this.itemsPerPage;
    this.getProducts();

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: route => {
          this.getProducts();
        }
      });

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: settings => {
          if (settings?.currency) {
            this.getProducts();
          } else if (settings?.language) {
            this.changeCategoryLang();
          }
        }
      });

    this.settingsService.regionalSettings$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: settings => {
          this.currency = settings?.currency
        }
      });

    this.auth.userTokens$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: tokens => {
          if (this.wishlistEvent) {
            this.onToggleFavorite(this.wishlistEvent, true)
          } else if (!this.authInitsub) {
            this.getProducts();
          }

          this.authInitsub = false;
        }
      });
  }

  changeCategoryLang() {
    let filtersQuery = this.routerActive.snapshot.params["query"] ?? '';
    const currentLang = localStorage.getItem('language') ?? '';
    const oldLang = currentLang == 'fr' ? 'en' : 'fr';
    const allCatsStr = localStorage.getItem("all-categorie");

    if (allCatsStr) {
      const allCats: any[] = JSON.parse(allCatsStr);

      if (this.activeUrl.startsWith('search/') || this.activeUrl.startsWith('promotions/')) {
        if (filtersQuery.includes('category_hierarchy')) {
          const subQuery = filtersQuery.split('&').find((f: any) => f.startsWith('category_hierarchy'));
          const param = subQuery.split('=');
          const category = param.length > 1 ? allCats.find(c => c.translations[oldLang].slug == param[1]) : null;
          if (category)
            filtersQuery = filtersQuery.replace(subQuery, `category_hierarchy&${category.translations[currentLang].slug}`);
        }

        this.router.navigate([`products/${this.activeUrl}`, filtersQuery ? { query: filtersQuery } : {}]);
      } else {
        const urlParts = this.activeUrl ? this.activeUrl.split('/') : [];
        let newUrlParts: any[] = [];
        urlParts.forEach(up => {
          const category = allCats.find(c => c.translations[oldLang].slug == up);
          newUrlParts.push(category.translations[currentLang].slug)
        });

        this.router.navigate([`products/${newUrlParts.join('/')}`, filtersQuery ? { query: filtersQuery } : {}]);
      }
    }
  }

  setBaseQuery() {
    if (this.activeUrl.startsWith('search/')) {
      return `search=${this.activeUrl.replace('search/', '')}`
    } else if (this.activeUrl.startsWith('promotions')) {
      return `in_promo=true`
    } else if (this.activeUrl) {
      return `category_hierarchy=${this.activeUrl}`
    }

    return '';
  }

  getProducts() {
    this.loadingProducts = true;
    this.activeUrl = this.routerActive.snapshot.url.map(u => u.path).join('/');
    const filtersQuery = this.routerActive.snapshot.params["query"];
    let query = this.setBaseQuery();

    if (filtersQuery) {
      query = `${query}&${filtersQuery}`
    }

    if (!this.filteringProducts) {
      this.loadingProductsInformations = true;
    }

    this.productsSub = this.productService.getProducts(query, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          this.productsList = [...res?.results ?? []];
          this.totalItems = res?.count;
          this.loadingProducts = false;
          if (this.scrollPosition) {
            this.ref.detectChanges();
            this.viewportScroller.scrollToPosition(this.scrollPosition);
            this.scrollPosition = undefined;
          }

          if (!this.filteringProducts) {
            this.loadingProductsInformations = true;
            if (this.filters && this.filters['category_hierarchy']) {
              this.filters['category_hierarchy'].choices = [];
            }

            let infoQuery = this.setBaseQuery();
            if (this.activeUrl.startsWith('search/') && filtersQuery?.includes('category_hierarchy')) {
              const cat = filtersQuery.split('&').find((f: any) => f.startsWith('category_hierarchy'));
              infoQuery += `&${cat}`
            }

            this.getInformationsProducts(infoQuery);
          } else {
            this.filteringProducts = false;
          }
        },
        error: error => {
          this.productsList = [];
          this.totalItems = 0;
          this.currentPage = 1;
          this.loadingProducts = false;
        }
      });
  }

  getInformationsProducts(query: string) {
    this.productService.getInformationsProducts(query)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (opts) => {
          this.loadingProductsInformations = false;
          this.filters = { ...opts.actions.filters }
          this.dynamicFiltersKeys = Object.keys(this.filters).filter(k => !this.excludedKeys.includes(k));
          this.initializeFiltersParams();
        },
        error: error => {
          this.loadingProductsInformations = false;
          console.log(error);
        }
      });
  }

  initializeFiltersParams() {
    const filtersQuery = this.routerActive.snapshot.params["query"];
    const activeFilters: any[] = [];
    this.filterParams = {};

    if (filtersQuery) {
      const queyParts = filtersQuery.split('&');

      queyParts.forEach((qp: string) => {
        const param = qp.split('=');

        switch (param[0]) {
          case 'category_hierarchy':
            if (this.activeUrl.startsWith('search/')) {
              this.filterParams['category_hierarchy'] = param[1];
            }
            break;
          case 'price_min':
            this.filterParams['price'] = { ...this.filterParams['price'] ?? {}, min: param[1] }
            break;
          case 'price_max':
            this.filterParams['price'] = { ...this.filterParams['price'] ?? {}, max: param[1] }
            break;
          default:
            if (this.filters[param[0]]?.type == 'MultipleChoiceFilter') {
              if (!this.filterParams[param[0]]) {
                this.filterParams[param[0]] = [];
              }

              const choices: any[] = this.filters[param[0]].choices ?? [];
              const val = param[0] == 'inspiration_country' ? param[1] : Number(param[1]);

              this.filterParams[param[0]].push(val);
              activeFilters.push({ key: `${param[0]}/${val}`, value: choices.find(ch => ch.value == val)?.display_name })
            } else if (this.filters[param[0]]?.type == 'BooleanFilter' && param[1]) {
              if (!this.filterParams[param[0]]) {
                this.filterParams[param[0]] = [];
              }

              this.filterParams[param[0]].push(param[1])
              activeFilters.push({ key: `${param[0]}/${param[1]}`, value: `${param[0]}: ${param[1] == 'true' ? 'Oui' : 'Non'}` })
            }
            break;
        }
      });

      if (this.filterParams['price']) {
        activeFilters.push({ key: 'price', value: `${this.filterParams['price'].min}${this.currency} - ${this.filterParams['price'].max}${this.currency}` })
      }
    }

    this.activeFilters = [...activeFilters];

    if (this.filters['category_hierarchy'] && !this.activeUrl.startsWith('search/')) {
      this.filterParams['category_hierarchy'] = this.activeUrl;
    }

    // if (this.filters['price'] && (this.filters['price'].min != 0 || this.filters['price'].max != this.searchMaxPrice)) {
    if (this.filters['price']) {
      const maxPrice = this.filters['price'].initial[1].max as number;
      this.filterParams['price'] = this.filterParams['price'] ?? { min: 0, max: maxPrice };
    }

    if (this.filters['inspiration_country']?.choices) {
      this.filterParams['inspiration_country'] = this.filterParams['inspiration_country'] ?? [];
    }

    this.dynamicFiltersKeys.forEach(key => {
      if (this.filters[key].type == 'MultipleChoiceFilter') {
        this.filterParams[key] = this.filterParams[key] ?? [];
      } else if (this.filters[key]?.type == 'BooleanFilter') {
        this.filterParams[key] = this.filterParams[key] ?? [];
      }
    });

    this.filterParams = { ... this.filterParams };
  }

  filterProducts(filter: any) {
    console.log(filter);
    const activeFilters = []
    let category_hierarchy;
    let query = '';

    for (const [key, value] of Object.entries(filter)) {
      if (key == 'category_hierarchy' && filter['category_hierarchy']) {
        if (this.activeUrl.startsWith('search/')) {
          query += `category_hierarchy=${filter['category_hierarchy']}`
        } else {
          category_hierarchy = filter['category_hierarchy'];
        }
      }
      else {
        if (Array.isArray(value)) {
          if (this.filters[key].type == 'BooleanFilter') {
            value.forEach((v: any) => {
              query += `${!query ? '' : '&'}${key}=${v}`
              activeFilters.push({ key: `${key}/${v}`, value: `${key}: ${v == 'true' ? 'Oui' : 'Non'}` })
            });
          } else {
            const choices: any[] = this.filters[key].choices ?? [];
            value.forEach((v: any) => {
              query += `${!query ? '' : '&'}${key}=${v}`
              activeFilters.push({ key: `${key}/${v}`, value: choices.find(ch => ch.value == v)?.display_name })
            });
          }
        }
        else if (typeof value === 'object') {
          const objValue = value as any;
          if (key == 'price') {
            const maxPrice = this.filters['price'].initial[1].max as number;
            if (objValue.min != 0 || objValue.max != maxPrice) {
              query += `${!query ? '' : '&'}${key}_min=${objValue.min}&${key}_max=${objValue.max}`
              activeFilters.push({ key, value: `${objValue.min}${this.currency} - ${objValue.max}${this.currency}` })
            }
          } else {
            Object.entries(objValue).forEach(([vKey, vValue]: any) => {
              query += `${!query ? '' : '&'}${key}_${vKey}=${vValue}`
              activeFilters.push({ key, value: vValue })
            });
          }
        }
      }
    }

    this.activeFilters = [...activeFilters];
    if (this.activeUrl == category_hierarchy) {
      this.filteringProducts = true;
    }

    this.router.navigate([`products/${category_hierarchy ? category_hierarchy : this.activeUrl}`, query ? { query } : {}]);
  }

  removefilter(key: string) {
    if (key == 'price') {
      const maxPrice = this.filters['price'].initial[1].max as number;
      this.filterParams.price = { min: 0, max: maxPrice }
    } else {
      const keyParts = key.split('/');
      if (keyParts.length == 2) {
        this.filterParams[keyParts[0]] = this.filterParams[keyParts[0]].filter((k: any) => k != keyParts[1]);
      } else {
        this.filterParams[key] = Array.isArray(this.filterParams[key]) ? [] : undefined;
      }
    }

    this.filterProducts(this.filterParams);
  }

  getPage(page: number) {
    this.currentPage = page;
    this.getProducts();
  }

  onViewProduct(event: any) {
    const product = event.product
    const slug = product.translations[this.translate.currentLang]?.slug

    if (event.ctrlKey) {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/products/view', `${slug}-${product.id}`]));
      window.open(url, '_blank');
    } else {
      const scrollPosition = this.viewportScroller.getScrollPosition();
      const backData = {
        backUrl: this.router.url.split(';')[0],
        query: this.routerActive.snapshot.params["query"],
        scrollPosition,
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage
      }

      this.router.navigate(['/products/view', `${slug}-${product.id}`], { state: { backData } });
    }
  }

  onToggleFavorite(event: any, reloadPoducts: boolean = false) {
    const isConnected = this.auth.isAuthenticated();
    if (!isConnected) {
      this.wishlistEvent = event;
      this.modalService.open(LoginOrRegisterComponent, { size: 'xs', windowClass: 'modal-login' });
      return;
    }

    this.wishlistEvent = undefined;
    if (event.isInFavorite) {
      this.wishlistService.deleteProductFromWishlist(event.productId)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (res) => {
            if (reloadPoducts) {
              this.getProducts();
            } else {
              this.updateProductWisthlist(event.productId, false);
            }

            this.toaster.success(this.translate.instant('wishlist.delete_article_msg'));
          },
          error: error => {
            console.log(error)
          }
        });
    } else {
      this.wishlistService.addProductToWishlist(event.productId)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (res) => {
            this.updateProductWisthlist(event.productId, true);
            this.toaster.success(this.translate.instant('wishlist.add_article_msg'));
          },
          error: error => {
            console.log(error)
          }
        });
    }
  }

  updateProductWisthlist(productId: number, inWishlist: boolean) {
    const product = this.productsList.find(p => p.id == productId)
    if (product) {
      const idx = this.productsList.indexOf(product)
      this.productsList[idx] = { ...product, is_in_wishlist: inWishlist }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
