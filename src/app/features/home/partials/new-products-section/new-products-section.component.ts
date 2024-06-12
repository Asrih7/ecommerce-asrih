import { ViewportScroller } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/@core/services/auth.service';
import { WishlistService } from 'src/@core/services/wishlist.service';
import { LoginOrRegisterComponent } from 'src/app/layout/header/login-or-register/login-or-register.component';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/@core/services/product.service';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-new-products-section',
  templateUrl: './new-products-section.component.html',
  styleUrls: ['./new-products-section.component.scss']
})
export class NewProductsSectionComponent implements OnInit {
  @ViewChild(CarouselComponent) owlCarousel: CarouselComponent;
  slideIndex = 1;
  public itemsPerPage: number = 40;
  public currentPage: number = 1;
  public wishlistEvent: any;

  public loadingProducts: boolean = false;
  public productsList: any[] = [];

  public carouselOptions: OwlOptions = {
    rewind: true,
    loop: true,
    nav: true,
    navText: [
      '<i class="fal fa-angle-left"></i>',
      '<i class="fal fa-angle-right"></i>'
    ],
    responsiveRefreshRate: 0,
    margin: 20,
    responsive: {
      0: {
        items: 1,
        slideBy: 1
      },
      350: {
        items: 2,
        slideBy: 2
      },
      580: {
        items: 3,
        slideBy: 3
      },
      750: {
        items: 4,
        slideBy: 4
      },
      950: {
        items: 5,
        slideBy: 5
      },
    }
  }
  private _unsubscribeAll: Subject<any> = new Subject();


  constructor(
    public translate: TranslateService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    public auth: AuthService,
    private modalService: NgbModal,
    private wishlistService: WishlistService,
    private toaster: ToastrService,
    private productService: ProductService) { }


  ngOnInit(): void {
    this.getProducts();
  }

  onViewProduct(event: any, product: any) {
    const slug = product.translations[this.translate.currentLang]?.slug

    if (event.ctrlKey) {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/products/view', `${slug}-${product.id}`]));
      window.open(url, '_blank');
    } else {
      const scrollPosition = this.viewportScroller.getScrollPosition();
      const backData = {
        backUrl: this.router.url,
        scrollPosition
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

  getProducts() {
    this.loadingProducts = true;
    this.productService.getProducts('', this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          this.productsList = [...res?.results ?? []];
          this.loadingProducts = false;
        },
        error: error => {
          this.productsList = [];
          this.loadingProducts = false;
        }
      });
  }

  updateProductWisthlist(productId: number, inWishlist: boolean) {
    const product = this.productsList.find(p => p.id == productId)
    if (product) {
      const idx = this.productsList.indexOf(product)
      this.productsList[idx] = { ...product, is_in_wishlist: inWishlist }
    }
  }
}
