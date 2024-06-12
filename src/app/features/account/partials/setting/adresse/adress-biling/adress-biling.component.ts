import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Address } from 'src/@core/models/address';
import { FormGeneric } from 'src/@core/models/form-generic';
import { BILLING_ADRESS_FORM } from 'src/@core/models/form.model';
import { Profile } from 'src/@core/models/profile';
import { AlertsService } from 'src/@core/services/alerts.service';
import { UserService } from 'src/@core/services/user.service';
import { scrollTop } from 'src/@core/utils/helpers';

@Component({
  selector: 'app-adress-billing',
  templateUrl: './adress-biling.component.html',
  styleUrls: ['./adress-biling.component.scss']
})
export class AdressBilingComponent implements OnChanges, OnDestroy {
  @Input() addressesFields = null;
  @Input() countriesList = [];
  @Input() profile: Profile;

  public form: FormGeneric = new FormGeneric(this.fb);
  public hideAddress: boolean = false;
  public showBtnAdd = false;
  public errors: any = [];
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private alertsService: AlertsService
  ) {
    this.form.group = this.fb.group(BILLING_ADRESS_FORM);
  }

  ngOnChanges(changes: any): void {
    if (changes.profile && changes.profile.currentValue != changes.profile.previousValue) {
      if (this.profile?.default_billing_address) {
        this.hideAddress = false;
        this.showBtnAdd = false;
        this.form.populateForm(this.profile.default_billing_address);
      } else {
        this.hideAddress = true;
        this.showBtnAdd = true;
      }
    }
  }

  showAddress(): any {
    this.hideAddress = false;
  }

  deleteAddresse(): void {
    if (!this.profile?.default_billing_address) {
      this.form.group.reset();
      this.hideAddress = true;
      this.showBtnAdd = false;
      this.errors = [];
      scrollTop();
    } else {
      this.profile.default_billing_address = undefined;
      delete this.profile.profile_picture;

      this.userService.patchProfil(this.profile.id, this.profile)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(profile => {
          if (profile) {
            this.userService.setProfile(profile);
            this.form.group.reset();
            this.alertsService.messageSuccessDelete(this.translate.instant('information_account.title_address_billing'));
            this.errors = [];
            scrollTop();
          }
        });
    }
  }

  editAdress() {
    this.errors = [];
    const editedAdress = {} as Address;
    this.form.assign(editedAdress);
    editedAdress.phone = editedAdress.phone?.internationalNumber?.length > 0 ? editedAdress.phone?.internationalNumber : editedAdress.phone?.number;
    editedAdress.id = this.profile?.default_billing_address?.id ?? undefined
    this.profile.default_billing_address = editedAdress;
    delete this.profile.profile_picture;

    this.userService.patchProfil(this.profile.id, this.profile)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: profile => {
          if (profile) {
            this.userService.setProfile(profile);

            if (this.showBtnAdd) {
              this.alertsService.messageSuccessInFirst(this.translate.instant('information_account.title_address_billing'));
            } else {
              this.alertsService.messageSuccess(this.translate.instant('information_account.title_address_billing'));
            }
          }
        },
        error: (err) => {
          if (err.status === 400) {
            for (const [key, value] of Object.entries(err.error.default_billing_address)) {
              this.errors = [...this.errors, { key, value }];
            }
          }
        }
      })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
