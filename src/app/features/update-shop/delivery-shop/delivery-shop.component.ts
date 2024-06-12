import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ShippingService } from 'src/@core/services/shipping.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DeleteConfirmation } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-delivery-shop',
  templateUrl: './delivery-shop.component.html',
  styleUrls: ['./delivery-shop.component.scss']
})
export class DeliveryShopComponent implements OnChanges, OnDestroy {
  @Input() shop: any;

  isOpen = false;
  errors: any = [];
  listField: any = [];
  defaultZone: any = [];
  shippingList: any;
  editMode: boolean;
  currentShipping: any;
  tableField: any;
  countryList: any[];

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public _dialog: MatDialog,
    private shippingService: ShippingService,
    private toaster: ToastrService,
    private translate: TranslateService
  ) {
  }

  ngOnChanges() {
    this.getsDefaultShippingZone();
    this.getShippingInfo();
    this.getShippings();
  }

  getsDefaultShippingZone(): void {
    if (this.shop?.id) {
      this.shippingService.getRequiredShippingZones(this.shop.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (zones: any) => {
            this.defaultZone = zones;
            localStorage.setItem('zones', JSON.stringify(zones));
          }
        });
    }
  }

  getShippingInfo(): void {
    if (this.shop?.id) {
      this.shippingService.getInformationsShipping(this.shop.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (fields: any) => {
            const list = fields.actions.POST;
            for (const [key, value] of Object.entries(list)) {
              this.listField = [...this.listField, { key, value }];
            }

            this.listField = this.listField.filter((field: any) => field.key !== 'id');
            this.tableField = this.listField.filter((field: any) => field.key == 'name' || field.key == 'zones');
          }
        });
    }
  }

  getShippings(): void {
    if (this.shop?.id) {
      this.shippingService.getShipping(this.shop.id)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: res => {
            this.shippingList = res;
            this.setShippingList();
          }
        });
    }
  }

  openModal(): void {
    this.isOpen = true;
    this.editMode = false;
    this.errors = []
  }

  editModal(shipping: any) {
    this.isOpen = true;
    this.currentShipping = shipping;
    this.editMode = true;
    this.errors = [];
  }

  handlercloseModal(val: any): void {
    this.isOpen = val;
  }

  handlerPostDelivery(values: any): void {
    this.shippingService.postShipping(values.data.shop, values.data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.isOpen = false;
            this.toaster.success(this.translate.instant('delivery.add_delivery'));
            this.getShippings();
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

  deleteConfirmation(id: number) {
    const dialogRef = this._dialog.open(DeleteConfirmation, {
      data: {
        title: this.translate.instant('delete_confirmation.delete_confirmation_title'),
        content: this.translate.instant('delivery.delete_confirmation_content'),
        cancelBtnText: this.translate.instant('delete_confirmation.delete_confirmation_cancel'),
        confirmBtnText: this.translate.instant('delete_confirmation.delete_confirmation_confirm')
      },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.deleteShip(id)
        }
      });
  }

  deleteShip(id: number) {
    this.shippingService.deleteShipping(this.shop.id, id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.isOpen = false;
          this.toaster.success(this.translate.instant('delivery.delete_delivery'));
          this.getShippings();
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
      });
  }

  handlerUpdateDelivery(event: any) {
    console.log('event', event)
    event.zones.forEach((ev: any) => {
      delete ev.isPays;
      delete ev.isRegion;
    });

    this.shippingService.patchShipping(this.shop.id, event.id, event)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.isOpen = false;
            this.toaster.success(this.translate.instant('delivery.add_delivery'));
            this.getShippings();
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

  // to verify
  setShippingList() {
    this.shippingList.forEach((shipping: any) => {
      shipping.zones.forEach((zone: any) => {
        if (zone.country != null && zone.country != '') {
          zone.country = JSON.parse(localStorage.getItem('countryList') || '{}').find((el: { value: string; }) => el.value == zone.country)?.display_name
        }
      })
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
