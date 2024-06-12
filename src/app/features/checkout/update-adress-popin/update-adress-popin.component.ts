import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Profile } from 'src/@core/models/profile';
import { Address } from 'src/@core/models/address';
import { UserService } from 'src/@core/services/user.service';
import { AlertsService } from 'src/@core/services/alerts.service';
import { FormBuilder } from '@angular/forms';
import { FormGeneric } from 'src/@core/models/form-generic';
import { BILLING_ADRESS_FORM } from 'src/@core/models/form.model';

@Component({
  selector: 'update-adress-popin',
  templateUrl: './update-adress-popin.component.html',
  styleUrls: ['./update-adress-popin.component.scss']
})
export class UpdateAdressPopinComponent implements OnChanges {
  @Input() isOpened: any;
  @Input() profile: Profile | null;
  @Input() adresseKey: string;
  @Input() adressFields: any[];
  @Input() countries: any[];
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() updateBasketItem: EventEmitter<any> = new EventEmitter();

  public addingAdress: boolean = false;
  public form: FormGeneric = new FormGeneric(this.fb);
  public addingAdressErrors: any = [];
  public emptyAdresse: Address;
  public activeAdress: Address | undefined;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    public translate: TranslateService,
    private alertsService: AlertsService,
    private fb: FormBuilder,
  ) {
    this.form.group = this.fb.group(BILLING_ADRESS_FORM);
  }

  ngOnChanges(changes: any): void {
    if (changes.profile && changes.profile.currentValue != changes.profile.previousValue) {
      if (this.profile?.default_shipping_address && this.adresseKey == 'Delivery') {
        this.activeAdress = { ... this.profile.default_shipping_address }
      } else if (this.profile?.default_billing_address) {
        this.activeAdress = { ... this.profile.default_billing_address }
      }
    }
  }

  closeModal(): void {
    this.close.emit(false);
  }

  setAddress(adr: Address) {
    this.activeAdress = { ...adr }
  }

  saveAddresses() {
    if (this.profile && this.activeAdress) {


      if (
        (this.adresseKey == 'Delivery' && this.activeAdress?.id == this.profile.default_shipping_address?.id) ||
        (this.adresseKey == 'Billing' && this.activeAdress?.id == this.profile.default_billing_address?.id)
      ) {
        this.close.emit(false);
        return;
      }


      this.profile.addresses = [...(this.profile.addresses ?? []).filter(a => a.id !== this.activeAdress?.id)];
      if (this.adresseKey == 'Delivery') {
        if (
          this.profile.default_shipping_address &&
          this.profile.default_shipping_address?.id != this.profile.default_billing_address?.id &&
          !this.profile.addresses?.find(x => x.id == this.profile?.default_shipping_address?.id)
        ) {
          this.profile.addresses.push({ ...this.profile.default_shipping_address });
        }

        this.profile.default_shipping_address = { ...this.activeAdress };
      } else {
        if (
          this.profile.default_billing_address &&
          this.profile.default_shipping_address?.id != this.profile.default_billing_address?.id &&
          !this.profile.addresses?.find(x => x.id == this.profile?.default_billing_address?.id)) {
          this.profile.addresses.push({ ...this.profile.default_billing_address });
        }

        this.profile.default_billing_address = { ...this.activeAdress };
      }

      delete this.profile?.profile_picture;
      this.userService.patchProfil(this.profile?.id, this.profile)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: profile => {
            if (profile) {
              this.close.emit(true);

              this.userService.setProfile(profile);
              if (this.adresseKey == 'Delivery') {
                this.alertsService.messageSuccess(this.translate.instant('information_account.title_address_delivery'));
              } else {
                this.alertsService.messageSuccess(this.translate.instant('information_account.title_address_billing'));
              }
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
    }
  }

  addNewAddress() {
    this.form.group.reset();
    this.addingAdress = true;
  }

  cancelAddAdress() {
    this.addingAdress = false;
  }

  editAddress() {
    this.addingAdressErrors = [];
    const editedAdress = {} as Address;
    this.form.assign(editedAdress);
    editedAdress.phone = editedAdress.phone?.internationalNumber?.length > 0 ?
      editedAdress.phone?.internationalNumber :
      editedAdress.phone?.number;
    editedAdress.id = undefined;

    if (this.profile) {
      delete this.profile.profile_picture;

      if (this.adresseKey == 'Delivery') {
        if (this.profile.default_shipping_address)
          this.profile.addresses?.push({ ...this.profile.default_shipping_address });
        this.profile.default_shipping_address = editedAdress;
      } else {
        if (this.profile.default_billing_address)
          this.profile.addresses?.push({ ...this.profile.default_billing_address });
        this.profile.default_billing_address = editedAdress;
      }

      this.userService.patchProfil(this.profile.id, this.profile)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: profile => {
            if (profile) {
              this.userService.setProfile(profile);
              this.addingAdress = false;

              if (this.adresseKey == 'Delivery') {
                this.alertsService.messageSuccess(this.translate.instant('information_account.title_address_delivery'));
              } else {
                this.alertsService.messageSuccess(this.translate.instant('information_account.title_address_billing'));
              }
            }
          },
          error: (err) => {
            if (err.status === 400) {
              for (const [key, value] of this.adresseKey == 'Delivery' ? Object.entries(err.error.default_shipping_address) : Object.entries(err.error.default_billing_address)) {
                this.addingAdressErrors = [...this.addingAdressErrors, { key, value }];
              }
            }
          }
        });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}