import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-product-card',
  templateUrl: './single-product-card.component.html',
  styleUrls: ['./single-product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleProductCardComponent implements OnChanges {
  constructor(private router: Router) {

  }
  @Input() product: any;
  @Input() parent: 'shop' | 'products' | 'wishlist';
  @Input() currentLang: string;

  @Output() deleteProduct = new EventEmitter<string>();
  @Output() editProduct = new EventEmitter<string>();
  @Output() viewProduct = new EventEmitter<{ product: any, ctrlKey: boolean }>();
  @Output() toggleFavorite = new EventEmitter<{ productId: number; isInFavorite: boolean }>();

  ngOnChanges(changes: SimpleChanges): void {
  }

  onEditProduct() {
    this.editProduct.emit(this.product?.id);

    if (this.currentLang == 'en' && this.product.translations.en.slug && this.product.translations.en.slug != '' || this.currentLang == 'fr' && !this.product.translations.fr) {
      this.router.navigate(['/shop/update-shop/' + this.product?.shop_slug + '/update-product/', `${this.product?.translations?.en?.slug}-${this.product?.id}`]);
    }
    else {
      this.router.navigate(['/shop/update-shop/' + this.product?.shop_slug + '/update-product/', `${this.product?.translations?.fr?.slug}-${this.product?.id}`]);
    }

  }

  onDeleteProduct() {
    this.deleteProduct.emit(this.product?.id);
  }

  onViewProduct(event: any) {
    this.viewProduct.emit({ product: this.product, ctrlKey: event.ctrlKey });
  }

  onToggleFavorite() {
    if (this.parent == 'wishlist') {
      this.toggleFavorite.emit({ productId: this.product.id, isInFavorite: true });
    } else {
      this.toggleFavorite.emit({ productId: this.product.id, isInFavorite: this.product.is_in_wishlist });
    }
  }
}