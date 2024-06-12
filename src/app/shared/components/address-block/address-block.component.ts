import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import _ from 'lodash';
import { FormGeneric } from 'src/@core/models/form-generic';
import { Shop } from 'src/@core/models/shop';

@Component({
  selector: 'app-address-block',
  templateUrl: './address-block.component.html',
  styleUrls: ['./address-block.component.scss']
})
export class AddressBlockComponent implements OnInit, OnChanges {
  @Input() addressfileds: any;
  @Input() submitFormCheck: any;
  @Input() countryList: any;
  @Input() errors: any;
  @Input() shopCurrent: Shop | undefined;
  @Input() form: FormGeneric = new FormGeneric(this.fb);

  errorObg: any = {};
  errs: any = [];

  searchedCountry: any = []
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnChanges(changes: any): void {
    if (changes.countryList) {
      this.searchedCountry = this.countryList
    }
    
    if (!_.isEmpty(this.errors)) {
      this.errors.forEach((element: any) => {
        if (element.key === 'shop_address') {
          for (const [key, value] of Object.entries(element.value)) {
            this.errs = [...this.errs, { key, value }];
          }
          this.errs = _.uniqBy(this.errs, 'key');
        }
      });
    } else {
      this.errs = [];
    }

    if (this.shopCurrent && changes.shopCurrent && (changes.shopCurrent.currentValue !== changes.shopCurrent.previousValue)) {
      this.inChanges();
    }
  }

  ngOnInit(): void {
    if (this.shopCurrent) {
      this.setFormValue();
    }
  }

  inChanges(): any {
    if (!_.isEmpty(this.shopCurrent)) {
      this.form.group.get('shop_address')?.setValue(this.shopCurrent.shop_address);
    }
  }

  displayCountFn(count?: any): string {
    let value: any;
    if (this.countryList) {
      value = this.countryList.find((item: any) => item.value == count)
    }

    return value ? value.display_name : "";
  }

  searchCountry(event: any) {
    this.searchedCountry = this.countryList.filter((item: any) => item.display_name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  formInit(): any {
    this.searchedCountry = this.countryList
    this.form.group = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      name_ext: new FormControl(null),
      company_name: new FormControl(null),
      street: new FormControl('', Validators.required),
      street2: new FormControl(''),
      postal_code: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      region: new FormControl(''),
      country: new FormControl('', Validators.required),
      longitude: new FormControl(null),
      latitude: new FormControl(null),
      phone: new FormControl(null),

    });
  }

  setFormValue(): any {
    this.searchedCountry = this.countryList
    this.form.group = new FormGroup({
      id: new FormControl(this.shopCurrent!.shop_address.id, Validators.required),
      name: new FormControl(this.shopCurrent!.shop_address.name, Validators.required),
      name_ext: new FormControl(this.shopCurrent!.shop_address.name_ext),
      company_name: new FormControl(this.shopCurrent!.shop_address.company_name),
      street: new FormControl(this.shopCurrent!.shop_address.street, Validators.required),
      street2: new FormControl(this.shopCurrent!.shop_address.street2),
      postal_code: new FormControl(this.shopCurrent!.shop_address.postal_code, Validators.required),
      city: new FormControl(this.shopCurrent!.shop_address.city, Validators.required),
      region: new FormControl(this.shopCurrent!.shop_address.region),
      country: new FormControl(this.shopCurrent!.shop_address.country, Validators.required),
      longitude: new FormControl(this.shopCurrent!.shop_address.longitude),
      latitude: new FormControl(this.shopCurrent!.shop_address.latitude),
      phone: new FormControl(this.shopCurrent!.shop_address.phone),

    });
  }
}
