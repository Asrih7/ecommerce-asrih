import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Deal } from '../../../../@core/models/deal';
import { FormGeneric } from '../../../../@core/models/form-generic';
import { DEAL_FORM, DISCOUNT_COUPON, SHIPPING_FORM } from '../../../../@core/models/form.model';
import { Discount } from 'src/@core/models/discount';
import { MaskedDate, dateFormatByLangue, inputDateFormatByLangue, } from 'src/@core/utils/helpers';
import { DatePipe } from '@angular/common';
import { ProductService } from 'src/@core/services/product.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';

@Component({
  selector: 'app-popin',
  templateUrl: './popin.component.html',
  styleUrls: ['./popin.component.scss']
})
export class PopinComponent implements OnInit, OnChanges {
  @Input() id: any;
  @Input() isOpen: any;
  @Input() title: any;
  @Input() fields: any;
  @Input() shop: any;
  @Input() errors: any;
  @Input() dealItem: Deal;
  @Input() discountItem: Discount;
  @Input() editMode: boolean;
  @Input() shipItem: any;

  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() values: EventEmitter<object> = new EventEmitter();
  @Output() updateValues: EventEmitter<object> = new EventEmitter();

  form: any;
  products: any = [];
  deal = {} as Deal;
  listofshops: any = [];
  allMessagesNotRead: any;
  fieldsZone: any = [];
  listCountries: any = [];
  arrZones: any;
  listProducts: any = [];
  isShop: boolean;
  isProduct: boolean;
  fieldsShop: any = []
  fieldDate: any = []
  fieldReduction: any = []
  isAmount: boolean;
  isPercentage: boolean;
  fieldProduct: any;
  requiredZone: any;
  userCurrency: string | null;
  addMode: boolean = false;
  dateMask: any;
  inputFormatDate: string;
  dateFormat: string;
  valDate: any;
  countryList: any;
  regionList: any;
  formGroups: any = [];
  zonesList: any = [];
  zonesErrors: any;
  zones: FormArray<any>;

  constructor(
    private fb: FormBuilder,
    private settingsService: RegionalSettingsService,
    private _productService: ProductService,
    private datePipe: DatePipe
  ) {
    this.form = new FormGeneric(fb);
  }

  ngOnInit(): void {
    this.settingsService.listCountries$.subscribe(data => {
      if (data) {
        localStorage.setItem('countryList', JSON.stringify(data));
        this.countryList = data;
      }
    });

    this.requiredZone = JSON.parse(localStorage.getItem('zones') || '{}');
    this.dateMask = MaskedDate;
    this.inputFormatDate = inputDateFormatByLangue;
    this.dateFormat = dateFormatByLangue;
    this.userCurrency = localStorage.getItem('user_currency');
    if (this.id == 'promotion') {
      this.form.group = this.fb.group(DEAL_FORM);
    }
    if (this.id == 'delivery') {
      this.form.group = this.fb.group(SHIPPING_FORM);
      this.zones = this.form.group.get('zones') as FormArray;

    }
    else if (this.id == 'discount_coupon') {
      this.form.group = this.fb.group(DISCOUNT_COUPON);
    }

    if (!this.editMode && this.id === 'discount_coupon') {
      this.initDiscountForm();
    }
    if (!this.editMode && this.id === 'promotion') {
      this.initForm();
    }
    if (this.editMode && this.id === 'promotion') {
      this.setItems();
    }
    if (this.editMode && this.id === 'discount_coupon') {
      this.setDiscountItem();
    }
    if (this.editMode && this.id === 'delivery') {
      this.setItemShipping();
    }
    if (!this.editMode && this.id === 'delivery') {
      this.initItemShipping();
    }
    if (this.shop && this.shop.products) {
      this.shop.products.forEach((product: any) => {
        if (product.translations.en) {
          this.products.push({ id: product.id, name: product.translations.en.name, shop: this.shop.name });
        }
      });
    }
  }

  closeModal(): void {
    this.closeModalEvent.emit(false);
    this.editMode = false;
  }

  ngOnChanges(changes: any): void {
    if (this.shop && changes.shop && changes.shop.currentValue !== changes.shop.previousValue) {
      //Shop changed
      this._productService.getShopProducts(this.shop.id, 0, 0).subscribe({
        next: (data) => { this.listProducts = data ?? []; }
      })
    }

    this.zonesErrors = this.errors.filter((el: { key: string; }) => el.key == "zones");
    this.userCurrency = localStorage.getItem('user_currency');
    if (!this.editMode) {
      this.isShop = true;
      this.isPercentage = true;
      this.isProduct = false;
      this.isAmount = false;
    }

    if (this.shop && changes.shop) {
      if (changes.shop.currentValue !== changes.shop.previousValue) {
        this.chooseForms();
        // this.errors.forEach(err => {
        console.log('err');
        // });
      }
    }

    if (this.editMode && this.id === 'promotion') {
      this.setItems();
    }

    if (this.editMode && this.id === 'discount_coupon') {
      this.setDiscountItem();
    }

    if (!this.editMode && !this.addMode && this.id === 'discount_coupon') {
      let defaultValActive: boolean = false;
      this.fields.forEach((field: any) => {
        if (field.key == 'active') {
          defaultValActive = field.value.default;
        }
      });
      this.initDiscountForm(defaultValActive)
    }

    if (this.isShop && this.shop?.id) {
      this.form.group.get('shop')?.setValue(this.shop.id);
    }

    if (changes && changes?.isOpen?.currentValue) {
      this.fieldReduction = [];
      this.fieldDate = [];
      this.fieldProduct = [];
      this.fieldsShop = []
      this.chooseForms();
    }
  }

  chooseForms(): void {
    switch (this.id) {
      case 'discount_coupon':
        this.fields.forEach((field: any) => {
          if (field.key == 'shop' || field.key == 'product') {
            this.fieldsShop.push(field);
          }
          if (field.value.type == 'date') {
            this.fieldDate.push(field);
          }
          if (field.key == 'discount_percentage' || field.key === 'discount_amount') {
            this.fieldReduction.push(field)
          }
          if (field.key == 'product') {
            this.fieldProduct = field;
          }
        })
        break;
      case 'promotion':
        this.form.group = this.fb.group(DEAL_FORM);
        this.fields.forEach((field: any) => {
          if (field.key == 'shop') {
            this.fieldsShop.push(field);
          }
          if (field.key == 'products') {
            this.fieldsShop.push(field);
          }
        })
        break;
      case 'delivery':
        this.form.group = this.fb.group(SHIPPING_FORM);

        this.fieldsZone = [];
        this.fields.forEach((field: any) => {
          if (field.key === 'zones') {
            for (const [key, value] of Object.entries(field.value.child.children)) {
              this.fieldsZone = [...this.fieldsZone, { key, value }];
            }
            this.fieldsZone.forEach((zone: any) => {
              if (zone.key === 'region') {
                this.regionList = zone.value.choices;
                localStorage.setItem('regionList', JSON.stringify(zone.value.choices));
              }
            });
          }

        });

        break;
      default:
        break;
    }
  }

  add(): void {
    let submitValues: any;
    if (this.id == 'delivery') {
      submitValues = {
        formulaire: this.id,
        data: {
          name: this.form.group.get('name').value,
          shop: this.shop.id,
          zones: this.zoneFormToList()
        }
      }
    } else {
      submitValues = {
        formulaire: this.id,
        data: this.form.group.value
      };
    }
    this.addMode = true;


    if (this.id == "promotion" && submitValues!.data.products == "") {
      submitValues!.data.products = [];
    }
    this.values.emit(submitValues);
  }

  getZoneForm() {
    return new FormGroup({
      id: new FormControl(null),
      country: new FormControl(null),
      region: new FormControl(null),
      inter: new FormControl(null),
      delay: new FormControl(null),
      alone: new FormControl(null),
      alone_currency: new FormControl(null),
      with_another_items: new FormControl(null),
      with_another_items_currency: new FormControl(null),
      minimum_order_amount: new FormControl(null),
      minimum_order_amount_currency: new FormControl(null),
      isPays: new FormControl(false),
      isRegion: new FormControl(false)
    })
  }

  handleChange(e: any) {
    var target = e.target;
    if (target.checked && target.defaultValue == 'shop') {
      this.isShop = true;
      this.isProduct = false;
      if (this.form.group.get('products')) {
        this.form.group.get('products').value = [];
      }
      else if (this.form.group.get('product')) {
        this.form.group.get('product').value = null;
      }
      this.form.group.get('shop')?.setValue(this.shop.id);
    } else {
      this.form.group.get('shop')?.setValue(null);
      this.isProduct = true;
      this.isShop = false;
    }
  }

  setItems() {
    if (this.dealItem.shop) {
      this.isShop = true;
    }
    else if (this.dealItem.products.length) {
      this.isProduct = true;
    }

    this.form.group = new FormGroup({
      id: new FormControl(this.dealItem.id),
      deal_percentage: new FormControl(this.dealItem.deal_percentage, Validators.required),
      shop: new FormControl(this.dealItem.shop),
      products: new FormControl(this.dealItem.products, Validators.required),
      name: new FormControl(this.dealItem.name, Validators.required)
    });
  }

  setDiscountItem() {
    if (this.discountItem.shop != null) {
      this.isShop = true;
      this.isProduct = false;
    }
    else if (this.discountItem.product != null) {
      this.isProduct = true;
      this.isShop = false;
    }
    if (this.discountItem.discount_amount != null) {
      this.isAmount = true;
      this.isPercentage = false;
    }
    else if (this.discountItem.discount_percentage != null) {
      this.isAmount = false;
      this.isPercentage = true;
    }
    this.form.group = new FormGroup({
      id: new FormControl(this.discountItem.id),
      coupon_code: new FormControl(this.discountItem.coupon_code, Validators.required),
      discount_amount: new FormControl(this.discountItem.discount_amount, Validators.required),
      discount_amount_currency: new FormControl(this.discountItem.discount_amount_currency, Validators.required),
      discount_percentage: new FormControl(this.discountItem.discount_percentage, Validators.required),
      shop: new FormControl(this.discountItem.shop, Validators.required),
      product: new FormControl(this.discountItem.product),
      active: new FormControl(this.discountItem.active, Validators.required),
      start_date: new FormControl(this.datePipe.transform(this.discountItem.start_date, this.dateFormat), Validators.required),
      end_date: new FormControl(this.datePipe.transform(this.discountItem.end_date, this.dateFormat), Validators.required)
    });
  }

  update() {
    if (this.id === 'delivery') {
      console.log('this.zoneFormToList()', this.zoneFormToList())
      this.updateValues.emit({
        id: this.shipItem.id,
        name: this.form.group.get('name').value,
        shop: this.shop.id,
        zones: this.zoneFormToList()
      })
    } else {
      this.updateValues.emit(this.form.group.value);
    }

  }

  initForm() {
    this.form.group = new FormGroup({
      id: new FormControl(''),
      deal_percentage: new FormControl('', Validators.required),
      shop: new FormControl(''),
      products: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required)
    });
  }

  initDiscountForm(defaultValActive?: boolean) {
    this.form.group = new FormGroup({
      id: new FormControl(),
      coupon_code: new FormControl('', Validators.required),
      discount_amount: new FormControl(null, Validators.required),
      discount_amount_currency: new FormControl('', Validators.required),
      discount_percentage: new FormControl(null, Validators.required),
      shop: new FormControl('', Validators.required),
      product: new FormControl(),
      active: new FormControl(defaultValActive, Validators.required),
      start_date: new FormControl(this.datePipe.transform(new Date(), this.dateFormat), Validators.required),
      end_date: new FormControl(null, Validators.required)
    })
  }

  changeDiscountType(event: any) {
    var target = event.target;
    if (target.checked && target.defaultValue == 'discount_percentage') {
      this.isPercentage = true;
      this.isAmount = false;
      this.form.group.get('discount_amount')?.setValue(null);
    } else {
      this.form.group.get('discount_percentage')?.setValue(null);
      this.isPercentage = false;
      this.isAmount = true;
    }
  }

  addRegion() {
    let zoneObj = this.getZoneForm();
    zoneObj.get('isRegion')?.setValue(true);
    this.zones.push(zoneObj);
  }

  addPays() {
    let zoneObj = this.getZoneForm();
    zoneObj.get('isPays')?.setValue(true);
    this.zones.push(zoneObj);
  }

  setItemShipping() {
    this.zones.clear();
    if (this.shipItem) {
      this.shipItem.zones.forEach((zone: any) => {
        let arryZones = new FormGroup({
          id: new FormControl(zone.id),
          country: new FormControl(zone.country),
          region: new FormControl(zone.region),
          inter: new FormControl(zone.inter),
          delay: new FormControl(zone.delay),
          alone: new FormControl(zone.alone),
          alone_currency: new FormControl(zone.alone_currency),
          with_another_items: new FormControl(zone.with_another_items),
          with_another_items_currency: new FormControl(zone.with_another_items_currency),
          minimum_order_amount: new FormControl(zone.minimum_order_amount),
          minimum_order_amount_currency: new FormControl(zone.minimum_order_amount_currency),
          isPays: new FormControl(zone.country != null && zone.country != '' && zone.country != this.requiredZone.country ? true : false),
          isRegion: new FormControl(zone.region != null && zone.region != '' && zone.region != this.requiredZone.region ? true : false)
        })
        this.zones.push(arryZones)
      });
      this.form.group = new FormGroup({
        id: new FormControl(this.shipItem.id),
        name: new FormControl(this.shipItem.name, Validators.required),
        shop: new FormControl(this.shipItem.shop, Validators.required),
        zones: this.zones
      })
    }

    if (this.shipItem) {
      this.shipItem.zones.forEach((el: any) => {
        if (el.country != null && el.country != '') {
          el.country = this.getNameCountry(el.country);
        }
        el.isRegion = false;
        el.isPays = false;
        let formGroup = this.fb.group(this.getZoneForm());
        this.formGroups.push(formGroup);
        this.zonesList.push(el);

      })
      this.form.group.get('name').setValue(this.shipItem.name);
    }

  }

  initItemShipping() {
    this.zones.clear();
    this.prepareZones();
    this.form.group = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', Validators.required),
      shop: new FormControl('', Validators.required),
      zones: this.zones
    })
  }

  removeItem(index: number) {
    if (index != -1) {
      this.zones.removeAt(index);
    }
  }

  prepareZones() {
    const keys = Object.keys(JSON.parse(localStorage.getItem('zones') || '{}'));
    keys.forEach(key => {
      if (key == 'country') {
        let zoneObj = this.getZoneForm();
        zoneObj.get('country')?.setValue(JSON.parse(localStorage.getItem('zones') || '{}').country)
        this.zones.push(zoneObj);
      }
      else if (key == 'region') {
        let zoneObj = this.getZoneForm();
        zoneObj.get('region')?.setValue(JSON.parse(localStorage.getItem('zones') || '{}').region)
        this.zones.push(zoneObj);
      }
      else if (key == 'inter') {
        let zoneObj = this.getZoneForm();
        zoneObj.get('inter')?.setValue(JSON.parse(localStorage.getItem('zones') || '{}').inter)
        this.zones.push(zoneObj);
      }
    });
  }

  getCodeCountry(country: string) {
    return this.countryList.find((el: { display_name: string; }) => el.display_name == country)?.value
  }

  getNameCountry(codeCountry: string) {
    if (this.countryList.find((el: { value: string; }) => el.value == codeCountry)?.display_name) {
      return this.countryList.find((el: { value: string; }) => el.value == codeCountry)?.display_name
    } else {
      return codeCountry
    }
  }

  zoneFormToList() {
    let zones: any[] = [];
    this.form?.group.get('zones').controls.forEach((element: any) => {
      zones.push(element.value);
    });
    let zonesCopie = JSON.parse(JSON.stringify(zones));
    zonesCopie.map((el: { country: string; }) => {
      if (el.country != null && el.country != '') {
        el.country = this.getCodeCountry(el.country) ? this.getCodeCountry(el.country) : null;
      }
    }
    );
    return zonesCopie;
  }
}