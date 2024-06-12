import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Wishlist } from 'src/@core/models/wishlist';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { WishlistService } from 'src/@core/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {
  public activeTab: 'articles' | 'shops' = 'articles'
  public wishlist: Wishlist | undefined;
  public loadingWishlist = false;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private wishlistService: WishlistService,
    private settingsService: RegionalSettingsService,
    public translate: TranslateService,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadingWishlist = true;
    this.wishlistService.wishlist$.subscribe({
      next: wishlist => {
        this.loadingWishlist = false;
        this.wishlist = wishlist;
      },
      error: error => {
        this.loadingWishlist = false;
        console.log(error);
      }
    });

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: settings => {
          if (settings?.currency) {
            this.getWishlist(true);
          }
        }
      });
  }

  getWishlist(activeLoader: boolean = true) {
    this.loadingWishlist = activeLoader
    this.wishlistService.getWishlist()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  onDeleteFavorite(productId: number) {
    this.wishlistService.deleteProductFromWishlist(productId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          const products = this.wishlist?.products?.filter(p => p.id != productId)
          this.wishlistService.setWishlist({ user: this.wishlist?.user, products, shops: [] })
          this.toaster.success(this.translate.instant('wishlist.delete_article_msg'));
        },
        error: error => {
          console.log(error)
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}