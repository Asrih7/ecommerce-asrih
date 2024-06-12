import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Address } from 'src/@core/models/address';
import { FormGeneric } from 'src/@core/models/form-generic';
import { ADDRESSES_FORM } from 'src/@core/models/form.model';
import { Profile } from 'src/@core/models/profile';
import { UserService } from 'src/@core/services/user.service';
import _ from 'lodash';
import { AlertsService } from 'src/@core/services/alerts.service';

@Component({
  selector: 'app-adress-other',
  templateUrl: './adress-other.component.html',
  styleUrls: ['./adress-other.component.scss']
})
export class AdressOtherComponent implements OnChanges {
  @Input() addressesFields = null;
  @Input() countriesList: any = [];
  @Input() profile: Profile;

  public arrAddress: FormArray<any> = new FormArray([] as any[]);
  public form: FormGeneric = new FormGeneric(this.fb);
  public hideAddress: boolean | undefined;
  public showBtnAdd = false;
  public addOneMore: boolean = false;
  public addedInFirst = false;
  public searchedCountry: any = []
  public errors: any = [];
  public map: any = [];
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private alertsService: AlertsService
  ) {
    this.form.group = this.fb.group(ADDRESSES_FORM);
  }

  ngOnChanges(changes: any): void {
    if (changes.countryList && changes.countryList.currentValue != changes.countryList.previousValue) {
      this.searchedCountry = this.countriesList
    }

    if (changes.profile && changes.profile.currentValue != changes.profile.previousValue) {
      this.populateAdressesForm();
    }
  }

  displayCountFn(count?: any): string {
    let value: any;
    if (this.countriesList) {
      value = this.countriesList.find((item: any) => item.value == count);
    }

    return value ? value.display_name : "";
  }

  searchCountry(event: any) {
    this.searchedCountry = this.countriesList.filter((item: any) => item.display_name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  populateAdressesForm(): void {
    if (this.profile) {
      if (!this.profile?.addresses?.length) {
        this.hideAddress = true;
        this.showBtnAdd = false;
      } else {
        this.arrAddress = new FormArray([] as any[]);
        this.hideAddress = false;
        this.showBtnAdd = true;

        this.arrAddress = this.form.group.get('addresses') as FormArray<any>;
        this.arrAddress.clear();
        this.profile.addresses?.forEach(address => {
          this.arrAddress.push(
            this.fb.group(
              {
                id: [address.id],
                name: [address.name],
                name_ext: [address.name_ext],
                company_name: [address.company_name],
                street: [address.street],
                street2: [address.street2],
                postal_code: [address.postal_code],
                city: [address.city],
                region: [address.region],
                country: [address.country],
                longitude: [address.longitude],
                latitude: [address.latitude],
                phone: [address.phone]
              }
            )
          );
        });
      }
    }
  }

  addNewAddress(): any {
    this.hideAddress = false;
    this.addOneMore = true;

    const addresse = new FormGroup(this.getAddressesForm());
    this.arrAddress?.insert(0, addresse);
  }

  getAddressesForm() {
    return {
      name: new FormControl('', Validators.required),
      name_ext: new FormControl(''),
      company_name: new FormControl(''),
      street: new FormControl('', Validators.required),
      street2: new FormControl(''),
      postal_code: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      region: new FormControl(''),
      country: new FormControl('', Validators.required),
      longitude: new FormControl(null),
      latitude: new FormControl(null),
      phone: new FormControl(null)
    }
  }

  deleteAddress(i: any): void {
    this.map = [];

    if (this.arrAddress?.controls.length) {
      this.arrAddress.controls.splice(i, 1);
      this.arrAddress.value.splice(i, 1);
      const editedAdresses: Address[] = this.arrAddress?.value;
      editedAdresses.forEach(adress => {
        adress.phone = adress.phone?.internationalNumber?.length > 0 ? adress.phone?.internationalNumber : adress.phone.number ? adress.phone.number : adress.phone
      });

      this.profile.addresses = editedAdresses;
      delete this.profile.profile_picture;

      this.userService.patchProfil(this.profile.id, this.profile).subscribe(profile => {
        if (profile) {
          this.userService.setProfile(profile);
          this.alertsService.messageSuccessDelete(this.translate.instant('information_account.one-address') + ' ' + i);
          this.addOneMore = false;
        }
      });
    }
  }

  editAdress(i: any): void {
    this.addOneMore = false;
    this.errors = [];
    this.map = [];
    
    let editedAdresses: Address[] = [];
    editedAdresses = this.arrAddress?.value;
    editedAdresses.forEach(adress => {
      adress.phone = adress.phone?.internationalNumber?.length > 0 ? adress.phone?.internationalNumber : adress.phone.number ? adress.phone.number : adress.phone
    });

    this.profile.addresses = editedAdresses;
    delete this.profile.profile_picture;

    this.userService.patchProfil(this.profile?.id, this.profile)
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
          if (err && err.status === 400) {
            this.errors = [];
            this.addOneMore = true;

            err.error.addresses.forEach((element: any, index: number) => {
              this.errors = [];
              if (!_.isEmpty(element)) {
                for (const [key, value] of Object.entries(element)) {
                  this.errors = [...this.errors, { key, value }];
                }
              }
              if (this.errors.length !== 0) {
                this.map[index] = this.errors;
              }
            });
          }
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
