import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-articles-wishlist',
  templateUrl: './articles-wishlist.component.html',
  styleUrls: ['./articles-wishlist.component.scss']
})
export class ArticlesWishlistComponent {
  @Input() products: any[] | undefined;
  @Input() loadingWishlist: boolean = false
  @Output() deleteFavorite = new EventEmitter<number>();

  public page: number = 1;
  public itemsPerPage: number = 10;
  public pageSizeOptions: number[] = [5, 10, 20, 50];

  constructor(
    public translate: TranslateService,
    private router: Router
  ) {
  }

  onViewProduct(event: any) {
    const product = event.product
    const slug = product.translations[this.translate.currentLang]?.slug

    if (event.ctrlKey) {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/products/view', `${slug}-${product.id}`]));
      window.open(url, '_blank');
    } else {
      this.router.navigate(['/products/view', `${slug}-${product.id}`]);
    }
  }

  onToggleFavorite(event: any) {
    this.deleteFavorite.emit(event.productId);
  }
}
