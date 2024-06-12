import { AfterContentChecked, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormGeneric } from 'src/@core/models/form-generic';
import { SHOP_INFOS } from 'src/@core/models/form.model';
import * as _ from 'lodash';
import { Shop } from 'src/@core/models/shop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-second-step',
  templateUrl: './address-second-step.component.html',
  styleUrls: ['./address-second-step.component.scss']
})
export class AddressSecondStepComponent implements OnInit, OnChanges {
  errorObg: any = {};
  errs: any = [];
  @Input() addressfileds: any;
  @Input() submitFormCheck: any;
  @Input() countryList: any;
  @Input() errors: any;
  @Input() shopCurrent: Shop | undefined;
  form: FormGeneric = new FormGeneric(this.fb);
  @Output() formAddressShopShared: EventEmitter<any> = new EventEmitter();
  searchedCountry: any = []
  constructor(private fb: FormBuilder, private router: Router) {
    this.form.group = this.fb.group(SHOP_INFOS);
  }
  handlerFormAddressShopShared(event: any) {

    this.formAddressShopShared.emit(event);
  }

  ngOnInit(): void {
    if (this.router.url.includes('create-shop')) {
      this.form.group.reset();
      this.formInit();

    }
  }

  inChanges(): any {
    if (!_.isEmpty(this.shopCurrent)) {
      this.form.group.get('shop_address')?.setValue(this.shopCurrent.shop_address);
      this.setValueForm();
    }
  }
  ngOnChanges(changes: any): void {
    if (changes.countryList) {
      this.searchedCountry = this.countryList
    }
    if (this.submitFormCheck) {
      this.formAddressShopShared.emit(this.form.group.value);
    }
    if (this.shopCurrent && changes.shopCurrent) {
      if (changes.shopCurrent.currentValue !== changes.shopCurrent.previousValue) {
        this.inChanges();
      }
    }
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
  setValueForm(){
    if(this.shopCurrent){
      this.searchedCountry = this.countryList
      this.form.group = new FormGroup({
  
        id: new FormControl(this.shopCurrent?.shop_address.id, Validators.required),
        name: new FormControl(this.shopCurrent?.shop_address.name, Validators.required),
        name_ext: new FormControl(this.shopCurrent?.shop_address.name_ext),
        company_name: new FormControl(this.shopCurrent?.shop_address.company_name),
        street: new FormControl(this.shopCurrent?.shop_address.street, Validators.required),
        street2: new FormControl(this.shopCurrent?.shop_address.street2),
        postal_code: new FormControl(this.shopCurrent?.shop_address.postal_code, Validators.required),
        city: new FormControl(this.shopCurrent?.shop_address.city, Validators.required),
        region: new FormControl(this.shopCurrent?.shop_address.region),
        country: new FormControl(this.shopCurrent?.shop_address.country, Validators.required),
        longitude: new FormControl(this.shopCurrent?.shop_address.longitude),
        latitude: new FormControl(this.shopCurrent?.shop_address.latitude),
        phone: new FormControl(this.shopCurrent?.shop_address.phone),
      });
    
    }
      
  }
}

