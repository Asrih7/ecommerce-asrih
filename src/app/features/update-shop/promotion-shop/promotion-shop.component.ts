import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Deal } from 'src/@core/models/deal';
import { DiscountService } from 'src/@core/services/discount.service';
import { DeleteConfirmation } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-promotion-shop',
  templateUrl: './promotion-shop.component.html',
  styleUrls: ['./promotion-shop.component.scss']
})
export class PromotionShopComponent implements OnChanges, OnDestroy {
  @Input() shop: any;
  public deals: any;

  isOpen = false;
  currentDeal: Deal;
  listField: any = [];
  errors: any = [];
  editMode: boolean = false;
  listProducts: any;
  fieldInTable: any = []

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public _dialog: MatDialog,
    private discountService: DiscountService,
    private toaster: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnChanges(): void {
    this.getDeals();
    this.getDealsInfo();
    this.listProducts = this.shop?.products ?? [];
  }

  getDealsInfo() {
    if (this.shop?.id) {
      this.discountService.getInfomationsDeal(this.shop.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (fields: any) => {
            const list = fields.actions.GET;
            for (const [key, value] of Object.entries(list)) {
              this.listField = [...this.listField, { key, value }];
            }

            this.listField = this.listField.filter((field: any) => field.key !== 'id' && field.key !== 'nb_products');
            this.fieldInTable = this.listField.filter((field: any) => field.key !== 'shop').reverse();
          }
        });
    }
  }

  getDeals() {
    if (this.shop?.id) {
      this.discountService.getDeal(this.shop.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(resp => {
          this.deals = resp ?? [];
        })
    }
  }

  openModal(): void {
    this.isOpen = true;
    this.editMode = false;
  }

  handlercloseModal(val: any): void {
    this.isOpen = val;
    this.errors = []
  }

  handlerPostDeal(values: any): void {
    this.discountService.createDeal(this.shop.id, values.data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.isOpen = false;
            this.toaster.success(this.translate.instant('promotion.add_deal'));
            this.getDeals();
            this.discountService.discountChanged();
          }
        },
        error: (err: any) => {
          if (err.status === 400) {
            this.errors = [];
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
            }
          }
        }
      });
  }

  deleteConfirmation(dealId: number) {
    const dialogRef = this._dialog.open(DeleteConfirmation, {
      data: {
        title: this.translate.instant('delete_confirmation.delete_confirmation_title'),
        content: this.translate.instant('promotion.delete_confirmation_content'),
        cancelBtnText: this.translate.instant('delete_confirmation.delete_confirmation_cancel'),
        confirmBtnText: this.translate.instant('delete_confirmation.delete_confirmation_confirm')
      },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.deleteDeal(dealId)
        }
      });
  }

  deleteDeal(dealId: number) {
    this.discountService.deleteDeal(dealId, this.shop.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: () => {
            this.isOpen = false;
            this.toaster.success(this.translate.instant('promotion.delete_deal'));
            this.getDeals();
          },
          error: (err: any) => {
            if (err.status === 400) {
              this.errors = [];
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }];
              }

              this.toaster.error(err.error[0]);
            }
          }
        }
      );
  }

  editModal(deal: Deal) {
    this.isOpen = true;
    this.currentDeal = deal;
    this.editMode = true;
    this.errors = [];
  }

  handlerUpdateDeal(event: any) {
    let id = event.id;
    delete event.id;
    this.discountService.patchDealOfDiscount(this.shop.id, id, event)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: () => {
            this.toaster.success(this.translate.instant('promotion.add_deal'));
            this.isOpen = false;
            this.getDeals();
            this.discountService.discountChanged();
          },
          error: (err: any) => {
            if (err.status === 400) {
              this.errors = [];
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }];
              }
            }
          }
        }
      );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
