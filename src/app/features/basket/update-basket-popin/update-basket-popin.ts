import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from 'src/@core/services/product.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'update-basket-popin',
  templateUrl: './update-basket-popin.component.html',
  styleUrls: ['./update-basket-popin.component.scss']
})
export class UpdateBasketPopinComponent implements OnInit {
  @Input() isOpened: any;
  @Input() basketItem: any;
  @Input() errors: any;

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() updateBasketItem: EventEmitter<any> = new EventEmitter();

  public product: any;
  public inventotyPrice: any;
  public productAttrs: any = {};
  public productAttrsKeys: any[] = [];
  public commonProductAttrs: any[] = [];
  public selectedAttrs: any = {};
  public unexistingComb = false;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private productService: ProductService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getProduct(this.basketItem.product)
  }

  getProduct(id: number) {
    this.productService.getProductById(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: product => {
          this.product = product;
          this.inventotyPrice = this.product?.inventory.find((a: any) => a.id === this.basketItem.variant);
          this.getProductAttributes(product);
          this.setDefalutAttrs();
        },
        error: error => { console.log(error); }
      });
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

  setDefalutAttrs() {
    this.selectedAttrs = {};
    this.productAttrsKeys.forEach((key: any) => {
      if (this.productAttrs[key].length > 1) {
        const attr = this.productAttrs[key].find((p: any) => this.inventotyPrice?.combination.includes(p.id));
        if (attr) {
          this.selectedAttrs[key] = attr.id;
        }
      }
    });
  }

  attrChange(value: number, key: string) {
    this.selectedAttrs[key] = value ?? undefined;
    const combination = [...Object.values(this.selectedAttrs)];

    if (combination.length != (this.productAttrsKeys.length - this.commonProductAttrs.length)) {
      return;
    }

    const invComb = this.product.inventory.find((i: any) => i.combination.sort().join('/') == combination.sort().join('/'));
    if (invComb) {
      this.unexistingComb = false;
      this.inventotyPrice = invComb;
    } else {
      this.unexistingComb = true;
    }
  }

  closeModal(): void {
    this.close.emit(false);
  }

  updateBasket() {
    this.basketItem.variant = this.inventotyPrice?.id;
    if (this.basketItem?.customization_content?.length) {
      let quantity = 0;
      this.basketItem?.customization_content.forEach((c: any) => {
        quantity += c.quantity ?? 0;;
      });
      this.basketItem.quantity = quantity;
    }

    this.updateBasketItem.emit(this.basketItem);
  }

  deleteCustomisation(index: number) {
    if (this.basketItem?.customization_content?.length) {
      delete this.basketItem.customization_content[index];
      this.basketItem.customization_content = this.basketItem?.customization_content.filter((c: any) => !!c);
    }
  }

  addCustomisation() {
    if (!this.basketItem?.customization_content) {
      this.basketItem.customization_content = [];
    }

    this.basketItem.customization_content.push({ quantity: 1, customization: '' });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}