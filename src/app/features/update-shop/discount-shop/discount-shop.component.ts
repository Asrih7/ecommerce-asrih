import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Discount } from 'src/@core/models/discount';
import { DiscountService } from 'src/@core/services/discount.service';
import { DeleteConfirmation } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-discount-shop',
  templateUrl: './discount-shop.component.html',
  styleUrls: ['./discount-shop.component.scss']
})
export class DiscountShopComponent implements OnChanges, OnInit, OnDestroy {
  @Input() shop: any;
  public listDiscount: Discount[] = [];

  currentDiscount: Discount;
  editMode: boolean = false;
  isOpen: boolean = false;

  listField: any = [];
  fieldInTable: any = [];
  errors: any = [];
  userCurrency: string | null;
  dateFormat: string;
  lang: string | null;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public _dialog: MatDialog,
    private discountServices: DiscountService,
    private toaster: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnChanges(): void {
    this.getDiscounts();
    this.getDiscountsInf();
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('language');
    this.dateFormat = 'yyyy-MM-dd';
    this.userCurrency = localStorage.getItem('user_currency');
  }

  getDiscounts(): void {
    if (this.shop?.id) {
      this.discountServices.getAllDiscountByShopId(this.shop.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          {
            next: data => {
              this.listDiscount = data ?? [];
            }
          });
    }
  }

  getDiscountsInf() {
    if (this.shop?.id) {
      this.discountServices.getInfomationsDiscount(this.shop.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (fields: any) => {
            this.listField = [];
            this.fieldInTable = [];
            const list = fields.actions.GET;
            for (const [key, value] of Object.entries(list)) {
              if (key != 'id') {
                this.listField = [...this.listField, { key, value }];
              }
            }

            this.fieldInTable = this.listField.filter((field: any) => field.key !== 'shop' && field.key !== 'product' && field.key !== 'discount_amount_currency');
          }
        });
    }
  }

  openModal(): void {
    this.isOpen = true;
    this.editMode = false;
    this.errors = [];
  }

  handlercloseModal(val: any): void {
    this.isOpen = val;
    this.editMode = false;
  }

  handlerPostDiscount(values: any): void {
    let start_date;
    let end_date;
    if (String(values.data.start_date).includes('-')) {
      start_date = values.data.start_date.split('-')[2] + '-' + values.data.start_date.split('-')[1] + '-' + values.data.start_date.split('-')[0];
    }
    else if (values.data.start_date) {
      start_date = values.data.start_date.getFullYear() + '-' + (values.data.start_date.getMonth() + 1) + '-' + values.data.start_date.getDate();
    }
    if (String(values.data.end_date).includes('-')) {
      end_date = values.data.end_date.split('-')[2] + '-' + values.data.end_date.split('-')[1] + '-' + values.data.end_date.split('-')[0];
    }
    else if (values.data.end_date) {
      end_date = values.data.end_date.getFullYear() + '-' + (values.data.end_date.getMonth() + 1) + '-' + values.data.end_date.getDate();
    }
    values.data.start_date = start_date;
    values.data.end_date = end_date;

    this.discountServices.createDiscount(this.shop.id, values.data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.isOpen = false;
            this.toaster.success(this.translate.instant('discount_coupon.add_discount'));
            this.getDiscounts();
          }
        },
        error: (err: any) => {
          if (err.status === 400) {
            this.errors = [];
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
            }

            console.log('errors', this.errors)
          }
        }
      });
  }

  editDiscount(discount: Discount) {
    this.isOpen = true;
    this.currentDiscount = discount;
    this.editMode = true;
    this.errors = [];
  }

  deleteConfirmation(discountId: number | undefined) {
    const dialogRef = this._dialog.open(DeleteConfirmation, {
      data: {
        title: this.translate.instant('delete_confirmation.delete_confirmation_title'),
        content: this.translate.instant('discount_coupon.delete_confirmation_content'),
        cancelBtnText: this.translate.instant('delete_confirmation.delete_confirmation_cancel'),
        confirmBtnText: this.translate.instant('delete_confirmation.delete_confirmation_confirm')
      },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.deleteDiscount(discountId)
        }
      });
  }

  deleteDiscount(discountId: number | undefined) {
    this.discountServices.deleteDiscount(discountId!, this.shop.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: () => {
            this.isOpen = false;
            this.toaster.success(this.translate.instant('discount_coupon.delete_discount'));
            this.getDiscounts();
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

  handlerUpdateDiscount(event: any) {
    let id = event.id;
    delete event.id;
    let start_date;
    let end_date;
    if (String(event.start_date).includes('-')) {
      start_date = event.start_date.split('-')[2] + '-' + event.start_date.split('-')[1] + '-' + event.start_date.split('-')[0];

    }
    else {
      start_date = event.start_date.getFullYear() + '-' + (event.start_date.getMonth() + 1) + '-' + event.start_date.getDate();
    }
    if (String(event.end_date).includes('-')) {
      end_date = event.end_date.split('-')[2] + '-' + event.end_date.split('-')[1] + '-' + event.end_date.split('-')[0];
    }
    else {
      end_date = event.end_date.getFullYear() + '-' + (event.end_date.getMonth() + 1) + '-' + event.end_date.getDate();
    }
    event.start_date = start_date;
    event.end_date = end_date;
    this.discountServices.updateDiscount(this.shop.id, id, event)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.toaster.success(this.translate.instant('discount_coupon.edit_discount'));
          this.isOpen = false;
          this.editMode = false;
          this.getDiscounts();
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}

