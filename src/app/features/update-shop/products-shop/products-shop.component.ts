import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { DiscountService } from 'src/@core/services/discount.service';
import { ProductService } from 'src/@core/services/product.service';
import { DeleteConfirmation } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-products-shop',
  templateUrl: './products-shop.component.html',
  styleUrls: ['./products-shop.component.scss']
})
export class ProductsShopComponent implements OnChanges, OnInit, OnDestroy {
  @Input() shop: any;

  public productsList: any[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public pageSizeOptions: number[] = [5, 10, 20, 50];

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private discountService: DiscountService,
    private _productService: ProductService,
    public _translate: TranslateService,
    public _dialog: MatDialog,
    private _toaster: ToastrService
  ) { }

  ngOnChanges(): void {
    this.getProducts();
  }

  ngOnInit(): void {
    this.discountService.priceChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: changed => {
          if (changed) {
            this.getProducts();
          }
        }
      });
  }

  getProducts() {
    if (this.shop?.id) {
      this._productService.getShopProducts(this.shop.id, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (res) => {
            this.productsList = [...res?.results ?? []];
            this.totalItems = res?.count;
          },
          error: error => {
            this.productsList = [];
            this.totalItems = 0;
            console.log(error);
          }
        }
        );
    }
  }

  getPage(page: number) {
    this.currentPage = page;
    this.getProducts();
  }

  deleteConfirmation(productId: string) {
    const dialogRef = this._dialog.open(DeleteConfirmation, {
      data: {
        title: this._translate.instant('delete_confirmation.delete_confirmation_title'),
        content: this._translate.instant('product.delete_confirmation_content'),
        cancelBtnText: this._translate.instant('delete_confirmation.delete_confirmation_cancel'),
        confirmBtnText: this._translate.instant('delete_confirmation.delete_confirmation_confirm')
      },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.onDeleteProduct(productId)
        }
      });
  }

  onDeleteProduct(productId: string) {
    this._productService.deleteShopProduct(this.shop.id, productId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.getProducts();
          this._toaster.success(this._translate.instant('product.product_deleted'));
        },
        error: error => {
          console.log(error);

          this._toaster.error(error.error[0]);
        }
      }
      );
  }

  onEditProduct(productId: any) {
    console.log(productId);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
