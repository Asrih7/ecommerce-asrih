import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ToastrService } from 'ngx-toastr';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { Translation } from 'src/@core/models/dispute';
import { FormGeneric } from 'src/@core/models/form-generic';
import { PRODUCT } from 'src/@core/models/form.model';
import { ProductService } from 'src/@core/services/product.service';
import { ShippingService } from 'src/@core/services/shipping.service';
import { TranslateDataService } from 'src/@core/services/translateData.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from 'src/@core/services/shop.service';
import { UserService } from 'src/@core/services/user.service';
import { FilesService } from 'src/@core/services/files.service';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  public currentShop: any;
  public currentProduct: any;
  public shopName: string;
  public productSlug: string;
  public shippingField: any = [];
  public isShippingModalOpen = false;
  public countriesList: any[] = [];
  public shippingProfiles: any = [];
  public productSheetFields: any = [];
  public selectBoxsFields: any = [];
  public inventoryFields: any = [];
  public customizationFields: any = []
  public isVisibleField: any
  public keywordsField: any
  public customizableField: any;
  public categoriesList: any[] = [];
  public categoriesOriginList: any[] = [];
  public productImgsFiles: any = [];
  public arrTranslate: any = [];
  public formData = new FormData();
  public keyWordsItems: any = [];
  public form: any;
  public searchedCategory: any = [];
  public languageProfile: string | undefined;
  public isCustomizable: boolean
  public errors: any = [];
  public activeCategory: any;
  public images: any = [];
  public boxImage: any = ["", "", "", "", "", "", "", "", ""];
  public listFieldAttribute: any = [];
  public attributesChoices: any = [];
  public attributesList: any = [];
  public attributesUnits: any = [];
  public attributesFields: any = [];
  public product_attributes: FormArray<any>;
  public inventory: FormArray<any>;
  public attributesChoice: any = [];
  public attributesChoiceChecked: any = [];
  public attributesChoiceUnitDescimal: any = [];
  public attributesChoiceUnitInteger: any = [];
  public attributesChoiceUnitsString: any = [];
  public attributesChoiceBool: any = [];
  public attributesChoiceCurrentProduct: any = [];
  public attributeListWithAllTypes: any = []
  public invontarys: any = []
  public combination: any[][];
  public currentProductCombination: any[][];
  public attributeChoiceCuPr: any = []
  public listInventory: any = [];
  public showLoader = false;
  public userCurrency: string | null;
  public listUnits: any = [];
  public listAddedAttribute: any = [];
  public attributesBool: any = [];
  public submitted: any = [];
  public isSelectedCat: boolean = false;
  public inventorydefault: FormArray<any>;
  public isDerty: boolean = false;
  public dragIndex?: number;
  public copieLastInventory: any;
  public copieLastCombination: any
  public oldValue: any
  public newValueWithDefaultPriceIndex: number;
  public oldValueWithDefaultPriceIndex: number
  public filtredInventoryWithInfoStock: any = []
  public i: number = 0;
  public listLabelScales: any = []
  public scalesValue: any;
  public activeScale: any = []
  public scales: any;
  public isNotValidScales: boolean = false;
  public loadingProduct: boolean = false;
  public lodingProductFields: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(private shippingService: ShippingService, private routerActive: ActivatedRoute, private toaster: ToastrService, private translate: TranslateService, private translateDataService: TranslateDataService, private productService: ProductService, private fb: FormBuilder, private userService: UserService, private imageCompress: NgxImageCompressService, private spinner: NgxSpinnerService, private router: Router, private shopService: ShopService, private filesService: FilesService) {
    this.form = new FormGeneric(fb);
  }

  ngOnInit() {
    this.shopName = this.routerActive.snapshot.params["name"];
    this.productSlug = this.routerActive.snapshot.params["slug-id"];
    this.form.group = this.fb.group(PRODUCT);
    this.form.group.reset();
    this.product_attributes = this.form.group.get('product_attributes') as FormArray;
    this.inventory = this.form.group.get('inventory') as FormArray;
    this.userCurrency = localStorage.getItem('user_currency');

    this.shopService.getShopByName(this.shopName).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (shops) => {
        if (shops?.length) {
          this.currentShop = shops[0];
          this.getProductFields(this.currentShop.id);
        }
      },
      error: error => { console.log(error); }
    });

    this.form.group.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value: any) => {
      if (value.category === "") {
        this.attributesChoice = []
        this.combination = [];
        this.product_attributes.controls = []
        this.inventory.controls = []
        this.attributesChoices = []
        this.listFieldAttribute = []
      }
    });
    this.oldValue = this.form.group.get('inventory').getRawValue();
    this.form.group.get('inventory').valueChanges.subscribe((value: any) => {
      this.newValueWithDefaultPriceIndex = value.findIndex((el: any) => (el.default_price != null && el.default_price != '') || (el.stock != null && el.stock != ''));
      this.oldValueWithDefaultPriceIndex = this.oldValue.findIndex((el: any) => el.default_price != null && el.default_price != '' || el.stock != null && el.stock != '');
      this.oldValue = this.form.group.get('inventory').getRawValue();
    });
    this.userService.profile$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      if (data) { this.languageProfile = data._language; }
    });
  }

  getProductById(product_id_slug: any) {
    if (this.currentShop) {
      let productId = product_id_slug.split('-')[product_id_slug.split('-').length - 1];
      this.productService.getShopProductById(this.currentShop.id, productId).pipe(takeUntil(this._unsubscribeAll)).subscribe((product: any) => {
        this.loadingProduct = false;
        this.currentProduct = product;
        this.attributesList = this.currentProduct.product_attributes;
        this.editForm();
      });
    }
  }

  getInformationsShipping(shopId: number): void {
    this.shippingField = [];
    this.shippingService.getInformationsShipping(shopId).pipe(takeUntil(this._unsubscribeAll)).subscribe((fields: any) => {
      for (const [key, value] of Object.entries(fields.actions.POST)) {
        if (key != 'id')
          this.shippingField = [...this.shippingField, { key, value }];
      }
    });
  }

  handlerPostDelivery(values: any): void {
    this.shippingService.postShipping(values.data.shop, values.data).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (data: any) => {
        if (data) {
          this.isShippingModalOpen = false;
          if (this.currentShop.id) {
            this.productService.getInformationProduct(this.currentShop.id).pipe(takeUntil(this._unsubscribeAll)).subscribe((fields: any) => {
              this.shippingProfiles = fields.actions.POST.shipping_profiles.choices;
              this.form.group.get('shipping_profiles').value = [this.shippingProfiles[0].display_name]
            });
          }
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

  getProductFields(shopId: number) {
    this.lodingProductFields = true;
    this.productSheetFields = [];
    this.selectBoxsFields = [];
    this.inventoryFields = [];
    this.customizationFields = [];

    this.productService.getInformationProduct(shopId).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (data) => {
        if (!data)
          return;

        this.countriesList = data.actions.POST.inspiration_country?.child.choices ?? [];
        this.shippingProfiles = data.actions.POST.shipping_profiles?.choices ?? [];
        this.categoriesOriginList = data.actions.POST.category.choices ?? [];
        this.categoriesList = (data.actions.POST.category.choices ?? []).map((c: any) => { return { ...c, display_name: c.display_name.split("/").join("▶") } });

        for (const [key, value] of Object.entries(data.actions.POST)) {
          if (["name", "description", "category", "product_attributes", "images"].includes(key)) {
            this.productSheetFields = [...this.productSheetFields, { key, value }];
          } else if (["inspiration_country", "shipping_profiles"].includes(key)) {
            this.selectBoxsFields = [...this.selectBoxsFields, { key, value }];
          } else if (key == 'inventory') {
            for (const [ck, cv] of Object.entries((value as any).child.children)) {
              if (["default_price", "stock"].includes(ck))
                this.inventoryFields = [...this.inventoryFields, { key: ck, value: cv }];
            }

            this.inventoryFields.push({ key: "deleted", value: false })
          } else if (key == "is_visible") {
            this.isVisibleField = { key, value };
            this.form.group.get('is_visible').value = (value as any).default;
          } else if (key == "customization") {
            for (const [ck, cv] of Object.entries((value as any).children)) {
              if (ck != 'id')
                this.customizationFields = [...this.customizationFields, { key: ck, value: cv }];
            }
          } else if (key == "customizable") {
            this.customizableField = { key, value };
          } else if (key == "keywords") {
            this.keywordsField = { key, value };
          }
        }

        this.lodingProductFields = false;
        if (this.productSlug) {
          this.loadingProduct = true;
          this.getProductById(this.productSlug);
        } else {
          this.getInformationsShipping(this.currentShop.id);
        }
      },
      error: error => { this.lodingProductFields = false; console.log(error); }
    });
  }

  searchCategory(event: any) {
    const filteredList = this.categoriesList.filter((item: any) => item.display_name.toLowerCase().includes(event.target.value.toLowerCase()))
    this.searchedCategory = filteredList.sort((a: any, b: any) => {
      const value = event.target.value.toLowerCase();
      if (a.display_name.toLowerCase().startsWith(value) && !b.display_name.toLowerCase().startsWith(value)) { return -1; }
      else if (!a.display_name.toLowerCase().startsWith(value) && b.display_name.toLowerCase().startsWith(value)) { return 1; }
      else { return a.display_name.toLowerCase().localeCompare(b.display_name.toLowerCase()); }
    });
  }

  prepareKeyWords(e: any): any {
    if (this.form.group.get('keywords').value != null && this.form.group.get('keywords').value.trim().length) {
      this.keyWordsItems.push(this.form.group.get('keywords').value);
      this.form.group.get('keywords').setValue('');
    }
  }

  deleteKeyword(i: any): any {
    this.keyWordsItems = this.keyWordsItems.filter((word: any, index: number) => index !== i);
  }

  deletePicture(index: number) {
    this.images.splice(index, 1);
    this.boxImage.push("");
    this.productImgsFiles.splice(index, 1);
    this.productImgsFiles.forEach((file: any, index: number) => { file.ordering = index; });
    if (this.productImgsFiles.length)
      this.productImgsFiles[0].is_primary = true;
  }

  editPicture(index: number) {
    this.imageCompress.uploadFile().then(({ image, fileName, orientation }) => {
      this.imageCompress.compressFile(image, orientation, 50, 50).then(compressedImage => {
        this.images[index] = compressedImage;
        this.productImgsFiles[index] = {
          image: this.filesService.dataURLtoFile(compressedImage, fileName),
          is_primary: index == 0,
          ordering: index
        };
      });
    });
  }

  addProductImage() {
    this.imageCompress.uploadFile().then(({ image, fileName, orientation }) => {
      this.imageCompress.compressFile(image, orientation, 50, 50).then(compressedImage => {
        this.images.push(compressedImage);
        this.boxImage.pop();
        this.productImgsFiles.push({
          image: this.filesService.dataURLtoFile(compressedImage, fileName),
          is_primary: this.productImgsFiles.length == 0,
          ordering: this.productImgsFiles.length ?? 0
        });
      });
    });
  }

  toggleCheckedChange(event: any, key: string) {
    this.form.group.get(key)?.setValue(event.checked);
    if (key == 'customizable')
      this.isCustomizable = event.checked;
  }

  addOrUpdateProduct() {
    this.arrTranslate = [];
    this.formData = new FormData();
    this.spinner.show();
    for (let i = 0; i < this.productImgsFiles.length; i++) {
      this.formData.append(`images[${i}]image`, this.productImgsFiles[i].image ? this.productImgsFiles[i].image : null);
      this.formData.append(`images[${i}]ordering`, this.productImgsFiles[i].ordering);
      this.formData.append(`images[${i}]is_primary`, this.productImgsFiles[i].is_primary);
    }
    this.product_attributes.controls.forEach((control: any, index: number) => {
      if (this.product_attributes.controls[index].get('string_value')?.value != null && this.product_attributes.controls[index].get('attribute_size_scale')?.value == "") {
        this.isNotValidScales = true;
        this.spinner.hide();
        this.scrollToEl({ key: 'scales' });
        return
      } else if (this.product_attributes.controls[index].get('string_value')?.value != null && this.product_attributes.controls[index].get('attribute_size_scale')?.value != "") {
        this.isNotValidScales = false;
      }
    });
    let inspiration_country = this.getCodeCountry(this.form.group.get('inspiration_country').value);
    for (let i = 0; i < inspiration_country.length; i++) {
      this.formData.append('inspiration_country', inspiration_country[i] ?? null);
    }
    let shipping_profiles = this.getCodeShipping(this.form.group.get('shipping_profiles').value);
    for (let i = 0; i < shipping_profiles.length; i++) {
      this.formData.append('shipping_profiles', shipping_profiles[i] ? shipping_profiles[i] : null);
    }
    this.formData.append('is_visible', this.form.group.get('is_visible').value);
    this.formData.append('shop', this.currentShop?.id?.toString() ?? '');
    this.formData.append('category', this.activeCategory ? this.activeCategory.toString() : '');
    if (this.form.group.get('customizable').value) {
      this.formData.append('customizable', this.form.group.get('customizable').value);
      this.formData.append('customization.is_facultative', this.form.group.get('customization').get('is_facultative').value);
    }
    if (this.combination && this.combination.length) {
      for (let index = 0; index < this.combination.length; index++) {
        let elements = this.combination[index]
        let combination: any[] = [];
        elements.forEach((el: any) => { combination.push(el.temp_id) });
        let inventory = {
          combination: combination,
          default_price: this.form.group.get('inventory.' + index).get('default_price').value,
          default_price_currency: null,
          promotional_pricing: null,
          stock: this.form.group.get('inventory.' + index).get('stock').value,
          temp_combination: null,
          deleted: this.form.group.get('inventory.' + index).get('deleted').value
        }
        if (!inventory.deleted) {
          this.formData.append(`inventory[${index}]default_price`, inventory.default_price ? inventory.default_price : '');
          this.formData.append(`inventory[${index}]stock`, inventory.stock);
          for (let i = 0; i < combination.length; i++) {
            this.formData.append(`inventory[${index}]temp_combination[${i}]`, combination[i]);
          }
        }
      }
    } else if (this.form.group.get('inventory.' + 0) != null) {
      this.formData.append(`inventory[0]default_price`, this.form.group.get('inventory.' + 0).get('default_price').value ? this.form.group.get('inventory.' + 0).get('default_price').value : '');
      this.formData.append(`inventory[0]stock`, this.form.group.get('inventory.' + 0).get('stock').value);
    }
    for (let i = 0; i < this.attributeListWithAllTypes.length; i++) {
      this.formData.append(`product_attributes[${i}]temp_id`, this.attributeListWithAllTypes[i].temp_id ? this.attributeListWithAllTypes[i].temp_id : '');
      this.formData.append(`product_attributes[${i}]numeric_value`, this.attributeListWithAllTypes[i].numeric_value || this.attributeListWithAllTypes[i].decimal_value ? this.attributeListWithAllTypes[i].numeric_value : '');
      this.formData.append(`product_attributes[${i}]unit`, this.attributeListWithAllTypes[i].unit ? this.attributeListWithAllTypes[i].unit : '');
      this.formData.append(`product_attributes[${i}]string_value`, this.attributeListWithAllTypes[i].string_value ? this.attributeListWithAllTypes[i].string_value : '');
      this.formData.append(`product_attributes[${i}]attribute_size_scale`, this.attributeListWithAllTypes[i].attribute_size_scale ? this.attributeListWithAllTypes[i].attribute_size_scale : '');
      if (this.attributeListWithAllTypes[i].boolean_value) {
        this.formData.append(`product_attributes[${i}]boolean_value`, this.attributeListWithAllTypes[i].boolean_value);
      } else {
        this.formData.append(`product_attributes[${i}]boolean_value`, '');
      }
      this.formData.append(`product_attributes[${i}]attribute`, this.attributeListWithAllTypes[i].attribute ? this.attributeListWithAllTypes[i].attribute : '');
      this.formData.append(`product_attributes[${i}]attribute_choice`, this.attributeListWithAllTypes[i].attribute_choice ? this.attributeListWithAllTypes[i].attribute_choice : '');
    }
    let translations: any = { en: {}, fr: {} } as Translation;
    let customizationTranslations: any = { en: {}, fr: {} } as Translation;
    let string_value: any[] = [];
    this.attributeListWithAllTypes.forEach((attr: any) => {
      if (attr.string_value != null)
        string_value.push(attr.string_value);
    });
    const language = this.languageProfile === 'fr' ? 'en' : 'fr';
    if (this.form.group.get('description').value) {
      this.arrTranslate.push({ language, text: this.form.group.get('description').value, description: 'description' });
    }
    if (this.form.group.get('name').value) {
      this.arrTranslate.push({ language, text: this.form.group.get('name').value, name: 'name' });
    }
    if (this.keyWordsItems.toString()) {
      this.arrTranslate.push({ language, text: this.keyWordsItems.toString(), keywords: 'keywords' });
    }
    if (this.form.group.get('customization').get('instructions').value) {
      this.arrTranslate.push({ language, text: this.form.group.get('customization').get('instructions').value, instructions: 'instructions' });
    }
    if (this.arrTranslate.length && !this.isNotValidScales) {
      combineLatest(this.translateDataService.translate(this.arrTranslate)).pipe(takeUntil(this._unsubscribeAll)).subscribe((docs: any) => {
        docs.forEach((doc: any, i: number) => {
          this.arrTranslate?.forEach((item: any, j: number) => {
            if (i === j)
              item.doc = doc.translation;
          });
        });
        if (this.arrTranslate && this.arrTranslate.length > 0) {
          this.arrTranslate.forEach((item: any) => {
            if (item.description) {
              translations.en.description = item.language === 'en' ? item.doc : this.form.group.get('description').value;
              translations.fr.description = item.language === 'en' ? this.form.group.get('description').value : item.doc;
            }
            if (item.name) {
              translations.en.name = item.language === 'en' ? item.doc : this.form.group.get('name').value;
              translations.fr.name = item.language === 'en' ? this.form.group.get('name').value : item.doc;
            }
            if (item.keywords) {
              translations.en.keywords = item.language === 'en' ? item.doc : this.keyWordsItems.toString();
              translations.fr.keywords = item.language === 'en' ? this.keyWordsItems.toString() : item.doc;
            }
            if (item.instructions) {
              customizationTranslations.en.instructions = item.language === 'en' ? item.doc : this.form.group.get('customization').get('instructions').value;
              customizationTranslations.fr.instructions = item.language === 'en' ? this.form.group.get('customization').get('instructions').value : item.doc;
            }
          });
          if (this.form.group.get('customizable').value) {
            this.formData.append('customization.limit_char', this.form.group.get('customization').get('limit_char').value);
            this.formData.append('customization.translations', JSON.stringify(customizationTranslations));
          }

          this.formData.append('translations', JSON.stringify(translations));
        }

        this.productSlug ? this.putData() : this.postData();
      });
    } else if (this.arrTranslate.length == 0 && !this.isNotValidScales) {
      this.formData.append('translations', JSON.stringify(translations));
      this.productSlug ? this.putData() : this.postData();
    }
  }

  getCategoryCode(event: any) {
    this.attributesChoices = []
    this.listFieldAttribute = []
    this.attributesChoiceChecked = [];
    this.attributeListWithAllTypes = [];
    this.attributesChoice = []
    this.product_attributes = this.form.group.get('product_attributes') as FormArray;
    this.inventory = this.form.group.get('inventory') as FormArray;
    while (this.product_attributes.length !== 0) {
      this.product_attributes.removeAt(this.product_attributes.length - 1);
    }
    while (this.inventory.length !== 0) {
      this.inventory.removeAt(this.inventory.length - 1);
    }
    this.isSelectedCat = true;
    this.combination = [];
    this.inventory.push(this.getInventoryForm())
    const catValue = event.option.value.replaceAll('▶', '/');
    this.activeCategory = this.categoriesOriginList.filter((el: any) => el.display_name == catValue)[0].value;
    this.productService.getProductAttributeFields(this.activeCategory).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
      const list = res.actions.GET
      this.listLabelScales = Object.keys(list.scales.child.children).filter((key: any) => list.scales.child.children[key].type == "string").map((key: string) => {
        return { key: key, label: list.scales.child.children[key].label }
      });
      for (const [key, value] of Object.entries(list)) {
        this.listFieldAttribute = [...this.listFieldAttribute, { key, value }];
      }
    });

    this.productService.getProductAttributeByCategory(this.activeCategory).pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.attributesChoices = data.filter((el: { type: number; choices: string | any[]; units: string | any[]; }) => el.choices.length > 0 && el.units.length == 0 && el.type == 20);
      for (let index = 0; index < this.attributesChoices.length; index++) {
        if (this.attributesChoices[index].choices.length > 0 && this.attributesChoices[index].units.length == 0 && this.attributesChoices[index].type == 20) {
          this.product_attributes.push(this.getAttributeForm());
        }
      }
      this.attributesUnits = data.filter((el: { choices: string | any[]; scales: string | any[]; units: string | any[]; type: number }) => (el.choices.length == 0 && el.units.length > 0 && (el.type == 3 || el.type == 1)) || (el.scales.length > 0 && el.type == 22));
      for (let index = 0; index < this.attributesUnits.length; index++) {
        if ((this.attributesUnits[index].choices.length == 0 && this.attributesUnits[index].units.length > 0 && (this.attributesUnits[index].type == 3)) || (this.attributesUnits[index].choices.length == 0 && this.attributesUnits[index].scales.length > 0 && (this.attributesUnits[index].type == 22))) {
          this.product_attributes.push(this.getAttributeForm());
        }
      }
      this.scales = this.attributesUnits.filter((attr: any) => attr.type == 22);
      this.scalesValue = this.scales[0]?.scales.reduce((acc: { [x: string]: any[]; }, item: { [x: string]: any; }) => {
        Object.keys(item).forEach(key => {
          if (!acc[key] && key != 'attribute' && key != 'id' && item[key] != '') {
            acc[key] = [];
          }
          acc[key]?.push([item[key], item['id']]);
        });
        return acc;
      }, {});
      this.listLabelScales.forEach((scale: any, index: number) => {
        if (this.scalesValue && !this.scalesValue[scale.key])
          this.listLabelScales.splice(index, 1)
      });
      this.attributesBool = data.filter((el: { choices: string | any[]; units: string | any[]; type: number }) => el.choices.length == 0 && el.units.length == 0 && el.type == 2);
      for (let index = 0; index < this.attributesBool.length; index++) {
        if (this.attributesBool[index].choices.length == 0 && this.attributesBool[index].units.length > 0 && this.attributesBool[index].type == 2)
          this.product_attributes.push(this.getAttributeForm());
      }
    })
  }

  getCodeCountry(countryList: any) {
    return (countryList ?? []).map((country: string) => this.countriesList.find((el: { display_name: string; }) => el.display_name == country)?.value);
  }

  getCodeShipping(shippingList: any) {
    return (shippingList ?? []).map((shipping: string) => this.shippingProfiles.find((el: { display_name: string; }) => el.display_name == shipping)?.value as Number);
  }

  getNameCountry(codeCountry: string) {
    if (this.countriesList.find((el: { value: string; }) => el.value == codeCountry)?.display_name) {
      return this.countriesList.find((el: { value: string; }) => el.value == codeCountry)?.display_name
    } else {
      return codeCountry
    }
  }

  getInventoryForm(deleted?: boolean) {
    return new FormGroup({
      id: new FormControl(''),
      product: new FormControl(''),
      combination: new FormControl([]),
      default_price: new FormControl(''),
      default_price_currency: new FormControl(''),
      promotional_pricing: new FormControl(''),
      stock: new FormControl(''),
      temp_combination: new FormControl(''),
      deleted: new FormControl(deleted ? deleted : false)
    });
  }

  getAttributeForm() {
    return new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
      choices: new FormControl(null),
      units: new FormControl('', [Validators.required]),
      units_copy: new FormControl(''),
      searchable: new FormControl(null),
      type: new FormControl(null),
      categories: new FormControl(null),
      numeric_value: new FormControl(0, [Validators.min(1), Validators.pattern(/^[+-]?\d+$/)]),
      decimal_value: new FormControl(0, [Validators.min(0.01)]),
      string_value: new FormControl(null, [Validators.required]),
      numeric_value_copy: new FormControl(null),
      string_value_copy: new FormControl(null),
      translate_value: new FormControl(null),
      boolean_value: new FormControl(null),
      dataArray: new FormControl([]),
      attribute_size_scale: new FormControl(''),
      scales: new FormControl('')
    });
  }

  setChoicesData(event: any, attributes: any, choiceId: number, choiceValue: string) {
    if (event.target.checked) {
      let attribute = {
        temp_id: this.attributeListWithAllTypes.length ? this.attributeListWithAllTypes[this.attributeListWithAllTypes.length - 1].temp_id + 1 : this.attributeListWithAllTypes.length + 1,
        attribute: attributes.id,
        attribute_choice: choiceId,
        attribute_name: attributes.name,
        attribute_choice_name: choiceValue,
        id: choiceId
      }
      this.attributesChoiceChecked.push(attribute);
      this.attributeListWithAllTypes.push(attribute);
      this.i = 0
      const filtredChoicesByName = this.attributesChoiceChecked.filter((attribute: any) => attribute.attribute == attributes.id)
      const groupedDataAttribute = this.attributesChoiceChecked.reduce((result: any, item: any) => {
        const attribute = item.attribute;
        result[attribute] = result[attribute] || [];
        result[attribute].push(item);
        return result;
      }, {});
      if (filtredChoicesByName.length > 1) {
        this.attributesChoiceChecked.forEach((attribute: any) => {
          if (this.attributesChoice.findIndex((el: any) => el.attribute == attribute.attribute && el.attribute_choice == attribute.attribute_choice) == -1 && groupedDataAttribute[attribute.attribute].length > 1) {
            this.attributesChoice.push(attribute)
          }
        });
      }
    } else {
      const filtredChoicesByName = this.attributesChoiceChecked.filter((attribute: any) => attribute.attribute == attributes.id);
      if (filtredChoicesByName.length > 2 || filtredChoicesByName.length == 1) {
        this.attributesChoiceChecked.splice(this.attributesChoiceChecked.findIndex((el: any) => el.attribute_choice == choiceId && el.attribute == attributes.id), 1);
        if (filtredChoicesByName.length > 1) {
          this.attributesChoice.splice(this.attributesChoice.findIndex((el: any) => el.attribute_choice == choiceId && el.attribute == attributes.id), 1);
        }
      }
      else if (filtredChoicesByName.length <= 2) {
        this.attributesChoiceChecked.splice(this.attributesChoiceChecked.findIndex((el: any) => el.attribute_choice == choiceId && el.attribute == attributes.id), 1);
        this.attributesChoice.splice(this.attributesChoice.findIndex((el: any) => el.attribute_choice == choiceId && el.attribute == attributes.id), 1);
        filtredChoicesByName.forEach((att: any) => {
          if (this.attributesChoice.findIndex((el: any) => el.attribute_choice == att.attribute_choice && el.attribute == att.attribute) !== -1) {
            this.attributesChoice.splice(this.attributesChoice.findIndex((el: any) => el.attribute_choice == att.attribute_choice && el.attribute == att.attribute), 1);
          }
        });
      }
      this.attributeListWithAllTypes.splice(this.attributeListWithAllTypes.findIndex((el: any) => el.attribute_choice == choiceId && el.attribute == attributes.id), 1);
      this.i = 0
      const groupedDataAttribute = this.attributesChoiceChecked.reduce((result: any, item: any) => {
        const attribute = item.attribute;
        result[attribute] = result[attribute] || [];
        result[attribute].push(item);
        return result;
      }, {});
      this.attributesChoiceChecked.forEach((attribute: any) => {
        if (this.attributesChoice.findIndex((choice: any) => choice.attribute == attribute.attribute && choice.attribute_choice == attribute.attribute_choice) == -1 && groupedDataAttribute[attribute.attribute].length > 1) {
          this.attributesChoice.push(attribute)
        }
      });
    }
    this.setInventory(this.attributesChoice, false);
  }

  generateCombinations<T>(arrays: T[][]): T[][] {
    if (!arrays.length)
      return [[]];

    const remainingArrays = arrays.slice(1);
    const remainingCombinations = this.generateCombinations(remainingArrays);
    const combinations: T[][] = [];
    for (const element of arrays[0]) {
      for (const subCombination of remainingCombinations) {
        combinations.push([element, ...subCombination]);
      }
    }
    return combinations;
  }

  editForm() {
    this.currentProduct.images.forEach((img: any) => {
      this.images.push(img.image)
      this.boxImage.pop();
      const _this = this
      this.filesService.convertImageToBase64(img.image, function (base64Data: any) {
        const imageName = _this.filesService.getFileNameFromPath(img.image);
        _this.productImgsFiles.push({
          image: _this.filesService.dataURLtoFile(base64Data, imageName),
          is_primary: _this.productImgsFiles.length == 0,
          ordering: _this.productImgsFiles.length ?? 0
        });
      });
    });

    if (this.currentProduct.translations.en.keywords != "" || this.currentProduct.translations.fr.keywords) {
      this.keyWordsItems = this.languageProfile == 'en' ? this.currentProduct.translations.en.keywords.split(',') : this.currentProduct.translations.fr.keywords.split(',')
    }
    this.activeCategory = this.categoriesList.find((el: any) => el.value == this.currentProduct.category)?.value;
    this.form.group = new FormGroup({
      name: new FormControl(this.languageProfile == 'en' ? this.currentProduct.translations.en.name : this.currentProduct.translations.fr.name),
      description: new FormControl(this.languageProfile == 'en' ? this.currentProduct.translations.en.description : this.currentProduct.translations.fr.description),
      keywords: new FormControl(),
      images: new FormControl(),
      translations: new FormControl('', Validators.required),
      shop: new FormControl('', Validators.required),
      inspiration_country: new FormControl('', Validators.required),
      shipping_profiles: new FormControl(null, Validators.required),
      category: new FormControl(this.categoriesList.find((el: any) => el.value == this.currentProduct.category)?.display_name),
      product_attributes: new FormArray([]),
      inventory: new FormArray([]),
      customizable: new FormControl(false, Validators.required),
      is_visible: new FormControl(Validators.required),
      customization: new FormGroup({
        instructions: new FormControl(this.languageProfile == 'en' ? this.currentProduct.customization?.translations?.en?.instructions : this.currentProduct.customization?.translations?.fr?.instructions),
        is_facultative: new FormControl(this.currentProduct.customization?.is_facultative),
        limit_char: new FormControl(this.currentProduct.customization?.limit_char, Validators.required),
        translations: new FormControl('', Validators.required),
      })
    });
    this.form.group.get('customizable')?.setValue(this.currentProduct.customizable)
    this.isCustomizable = this.currentProduct.customizable
    this.form.group.get('is_visible')?.setValue(this.currentProduct.is_visible)
    let country_inspiration: any = []
    this.currentProduct.inspiration_country.forEach((country: string) => {
      country_inspiration.push(this.getNameCountry(country))
    });
    this.form.group.get('inspiration_country')?.setValue(country_inspiration);
    const currentShippingProfile: any = []
    this.shippingProfiles.forEach((profile: any) => {
      this.currentProduct.shipping_profiles.forEach((currentProfile: any) => {
        if (currentProfile == profile.value)
          currentShippingProfile.push(profile.display_name)
      });
    });
    this.form.group.get('shipping_profiles')?.setValue(currentShippingProfile);
    this.getProductAttributeByCategory(this.currentProduct.category);
    this.oldValue = this.form.group.get('inventory').getRawValue();
    this.form.group.get('inventory').valueChanges.subscribe((value: any) => {
      this.newValueWithDefaultPriceIndex = value.findIndex((el: any) => (el.default_price != null && el.default_price != '') || (el.stock != null && el.stock != ''));
      this.oldValueWithDefaultPriceIndex = this.oldValue.findIndex((el: any) => el.default_price != null && el.default_price != '' || el.stock != null && el.stock != '');
      this.oldValue = this.form.group.get('inventory').getRawValue();
    });
  }

  postData() {
    this.productService.postProduct(this.formData, this.currentShop.id).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (data: any) => {
        if (data) {
          this.productService.getShopProductById(this.currentShop.id, data.id).subscribe((product: any) => {
            this.errors = [];
            this.spinner.hide();
            this.toaster.success(this.translate.instant('product.add_product'));
            this.router.navigate(['/shop/update-shop/' + product?.shop_slug]);
          })
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        if (err.status === 400) {
          this.errors = [];
          for (const [key, value] of Object.entries(err.error)) {
            this.errors = [...this.errors, { key, value }];
          }
          if (this.errors[0].key == "translations" && this.errors[0]?.value.en.name.length) {
            this.scrollToEl({ key: 'name' });
          } else {
            this.scrollToEl(this.errors[0]);
          }
        }
      }
    });
  }

  putData() {
    this.productService.putProduct(this.formData, this.currentShop.id, this.currentProduct.id).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (data: any) => {
        if (data) {
          this.errors = [];
          this.spinner.hide();
          this.toaster.success(this.translate.instant('product.edit_product'));
          this.router.navigate(['/shop/update-shop/' + this.currentProduct?.shop_slug]);
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        if (err.status === 400) {
          this.errors = [];
          for (const [key, value] of Object.entries(err.error)) {
            this.errors = [...this.errors, { key, value }];
          }
          if (this.errors[0].key == "translations" && this.errors[0]?.value.en.name.length) {
            this.scrollToEl({ key: 'name' });
          } else {
            this.scrollToEl(this.errors[0]);
          }
        }
      }
    });
  }

  scrollToEl(error: any) {
    if ((<HTMLInputElement>document.getElementById(error.key)) != null)
      (<HTMLInputElement>document.getElementById(error.key)).scrollIntoView({ behavior: 'smooth', block: "end", inline: "end" });
  }

  setInventory(attribute_choice: any, bool?: boolean) {
    this.copieLastInventory = this.getCopieOfinventory();
    this.copieLastCombination = this.combination;
    this.inventory.controls.forEach((control: any, index: number) => {
      if (this.copieLastInventory && this.copieLastInventory[index])
        control.get('combination')?.setValue(this.copieLastInventory[index])
    })

    localStorage.setItem('copieLastInventory', JSON.stringify(this.copieLastInventory));
    const groupedMap = attribute_choice.reduce((entryMap: any, e: any) => entryMap.set(e.attribute, [...entryMap.get(e.attribute) || [], e]), new Map());
    let array = [...groupedMap.values()];
    this.combination = this.generateCombinations(array);
    for (let index = 0; index < this.combination.length; index++) {
      if (this.inventory.length < this.combination.length) {
        this.inventory.push(this.getInventoryForm())
      }
    }

    this.inventory.controls.forEach(control => {
      control.get('default_price')?.setValue(null);
      control.get('stock')?.setValue(null)
    });

    let deletedInventory: any = [];
    if (this.copieLastInventory?.length) {
      deletedInventory = [...this.copieLastInventory].filter((el: any) => el.deleted == true);
      const oldData = [...this.copieLastInventory]
      const filtredOLdData = [...this.copieLastInventory].map((el: any, index: number): any => {
        if (el.default_price != null && el.default_price != '' || el.stock != null && el.stock != '') {
          return { index: index, temps_id: el.combination.map((att: any) => { return att.temp_id }) }
        }
        else { return }
      });
      if (deletedInventory.length) {
        this.inventory.controls.forEach((el: any, index) => { el.get('deleted')?.setValue(false) });
      }
      const combinationArrayTempIds = this.combination.map((combins: any) => {
        return combins.map((combi: any) => { return combi.temp_id });
      });
      const deletedTempsId = deletedInventory.map((deleted: any) => {
        return deleted.combination.map((att: any) => { return att.temp_id })
      })
      const combiWithStock = filtredOLdData.filter(function (element: any) { return element !== undefined; });
      let indexDeleted: number = -1;
      let indexStock: number = -1;
      if (deletedTempsId.length > combinationArrayTempIds.length) {
        combinationArrayTempIds.forEach((temp_ids: any, index: number) => {
          if (combinationArrayTempIds[0]?.length == deletedTempsId[0]?.length && deletedTempsId.length > combinationArrayTempIds.length) {
            indexDeleted = deletedTempsId.findIndex((temp_deleted: any) => JSON.stringify(temp_deleted) == JSON.stringify(temp_ids))
          } else if (combinationArrayTempIds[0]?.length > deletedTempsId[0]?.length) {
            temp_ids.forEach((temp_deleted: any, i: number) => {
              if (deletedTempsId.some((deleted: any) => deleted.includes(temp_deleted)))
                indexDeleted = index;
            });
          } else if (combinationArrayTempIds[0]?.length < deletedTempsId[0]?.length) {
            temp_ids.forEach((id: any) => {
              indexDeleted = deletedTempsId.findIndex((temp_deleted: any) => temp_deleted.includes(id))
            });
          }
          const inventoryDeleted = this.inventory.controls.filter((control: any) => control.get('deleted')?.value == true)
          if (indexDeleted != -1 && inventoryDeleted.length < deletedInventory.length)
            this.inventory.controls[index].get('deleted')?.setValue(true)
        })
      } else if ((combinationArrayTempIds[0]?.length == deletedTempsId[0]?.length && deletedTempsId.length < combinationArrayTempIds.length) || (combinationArrayTempIds[0]?.length == deletedTempsId[0]?.length && deletedTempsId.length > combinationArrayTempIds.length)) {
        deletedTempsId.forEach((temp_deleted: any) => {
          indexDeleted = combinationArrayTempIds.findIndex((temp_ids: any) => JSON.stringify(temp_ids) == JSON.stringify(temp_deleted))
          if (indexDeleted == -1) {
            indexDeleted = combinationArrayTempIds.findIndex((temp_ids: any) => temp_ids[0] == temp_deleted[0])
          }
          const inventoryDeleted = this.inventory.controls.filter((control: any) => control.get('deleted')?.value == true)
          if (indexDeleted != -1 && inventoryDeleted.length <= deletedInventory.length) {
            this.inventory.controls[indexDeleted].get('deleted')?.setValue(true)
          }
        });
      } else if (deletedTempsId.length < combinationArrayTempIds.length && deletedTempsId.length && deletedTempsId[0].length < combinationArrayTempIds[0].length) {
        for (const deletedTempId of deletedTempsId) {
          outerLoop:
          for (const [index, elements] of combinationArrayTempIds.entries()) {
            if (deletedTempId.every((value: any, index: number) => value === elements[index])) {
              this.inventory.controls[index].get('deleted')?.setValue(true)
              break outerLoop;
            }
          };
        };

      }
      else if ((deletedTempsId.length < combinationArrayTempIds.length && deletedTempsId.length && deletedTempsId[0].length > combinationArrayTempIds[0].length) || (deletedTempsId.length == combinationArrayTempIds.length && deletedTempsId[0].length > combinationArrayTempIds[0].length)) {
        for (const [index, combination] of combinationArrayTempIds.entries()) {
          outerLoop:
          for (const elements of deletedTempsId) {
            if (combination.every((value: any, index: number) => value === elements[index])) {
              this.inventory.controls[index].get('deleted')?.setValue(true)
              break outerLoop;
            }
          };
        };
      } else if (deletedTempsId.length == combinationArrayTempIds.length) {
        for (const [index, elements] of combinationArrayTempIds.entries()) {
          if (elements[0] == deletedTempsId[0])
            this.inventory.controls[index].get('deleted')?.setValue(true)
        }
      }
      if (combiWithStock.length > combinationArrayTempIds.length) {
        combinationArrayTempIds.forEach((temp_ids: any, index: number) => {
          if (combinationArrayTempIds[0]?.length == combiWithStock[0].temps_id?.length && combiWithStock.length > combinationArrayTempIds.length) {
            indexStock = combiWithStock.findIndex((temp_deleted: any) => JSON.stringify(temp_deleted.temps_id) == JSON.stringify(temp_ids))
          } else if (combinationArrayTempIds[0]?.length < combiWithStock[0].temps_id?.length) {
            temp_ids.forEach((id: any) => {
              indexStock = combiWithStock.findIndex((temp_deleted: any) => temp_deleted.temps_id.includes(id))
            });
          }
          const inventoryWithStock = this.inventory.controls.filter((control: any) => control.get('stock')?.value != '' && control.get('stock')?.value != null && control.get('default_price')?.value != '' && control.get('default_price')?.value != '')
          if (indexStock != -1 && inventoryWithStock.length < combiWithStock.length) {
            this.inventory.controls[index].get('stock')?.setValue(oldData[combiWithStock[indexStock].index].stock)
            this.inventory.controls[index].get('default_price')?.setValue(oldData[combiWithStock[indexStock].index].default_price)
            this.inventory.controls[index].get('deleted')?.setValue(false)
          }
        });
      } else if (combiWithStock.length < combinationArrayTempIds.length && combiWithStock.length && combiWithStock[0].temps_id.length < combinationArrayTempIds[0].length) {
        for (const deletedTempId of combiWithStock) {
          outerLoop:
          for (const [index, elements] of combinationArrayTempIds.entries()) {
            if (deletedTempId.temps_id.every((value: any, index: number) => value === elements[index])) {
              this.inventory.controls[index].get('stock')?.setValue(oldData[deletedTempId.index].stock)
              this.inventory.controls[index].get('default_price')?.setValue(oldData[deletedTempId.index].default_price)
              this.inventory.controls[index].get('deleted')?.setValue(false)
              break outerLoop;
            }
          }
        };
      } else if ((combinationArrayTempIds[0]?.length == combiWithStock[0]?.temps_id.length && combiWithStock.length < combinationArrayTempIds.length) || (combinationArrayTempIds[0]?.length == combiWithStock[0]?.temps_id.length && combiWithStock.length > combinationArrayTempIds.length)) {
        combiWithStock.forEach((temp_deleted: any, index: number) => {
          indexStock = combinationArrayTempIds.findIndex((temp_ids: any) => JSON.stringify(temp_ids) == JSON.stringify(temp_deleted.temps_id))
          if (indexStock == -1) {
            indexStock = combinationArrayTempIds.findIndex((temp_ids: any) => temp_ids[0] == temp_deleted[0]?.temps_id)
          }
          const inventoryDeleted = this.inventory.controls.filter((control: any) => control.get('deleted')?.value == true);
          if (indexStock != -1 && inventoryDeleted.length <= deletedInventory.length) {
            this.inventory.controls[indexStock].get('stock')?.setValue(oldData[combiWithStock[index].index].stock)
            this.inventory.controls[indexStock].get('default_price')?.setValue(oldData[combiWithStock[index].index].default_price)
            this.inventory.controls[indexStock].get('deleted')?.setValue(false)
          }
        });
      } else if ((combiWithStock.length < combinationArrayTempIds.length && combiWithStock.length && combiWithStock[0].temps_id.length > combinationArrayTempIds[0].length) || (combiWithStock.length == combinationArrayTempIds.length && combiWithStock[0].temps_id.length > combinationArrayTempIds[0].length) || (combiWithStock.length == combinationArrayTempIds.length && combiWithStock[0].temps_id.length == combinationArrayTempIds[0].length)) {
        for (const [index, combination] of combinationArrayTempIds.entries()) {
          outerLoop:
          for (const elements of combiWithStock) {
            if (combination.every((value: any, index: number) => value === elements.temps_id[index])) {
              this.inventory.controls[index].get('stock')?.setValue(oldData[elements.index].stock)
              this.inventory.controls[index].get('default_price')?.setValue(oldData[elements.index].default_price)
              this.inventory.controls[index].get('deleted')?.setValue(false)
              break outerLoop;
            }
          }
        };
      }
    }
  }

  setUnits(index: number, name: string, id: number, isStringValue: boolean, type: number) {
    let dataArray = this.form.group.get('product_attributes').value[index].dataArray;
    dataArray.forEach((unit: any, i: number) => {
      let attribute = {
        temp_id: this.attributeListWithAllTypes.length ? this.attributeListWithAllTypes[this.attributeListWithAllTypes.length - 1].temp_id + 1 : this.attributeListWithAllTypes.length + 1,
        unit: unit.split(' ')[1],
        numeric_value: !isStringValue ? unit.split(' ')[0] : null,
        string_value: isStringValue ? unit.split(' ')[0] : null,
        attribute: id,
        attribute_name: name,
        attribute_choice_name: unit,
        type: type
      }
      const index_table = this.attributeListWithAllTypes.findIndex((e: { unit: any; numeric_value: any; string_value: any; attribute: number; attribute_name: string; attribute_choice_name: any; }) => e.unit === attribute.unit && e.attribute === attribute.attribute && e.numeric_value === attribute.numeric_value && e.string_value === attribute.string_value && e.attribute_name == attribute.attribute_name && e.attribute_choice_name === attribute.attribute_choice_name);
      if (index_table == -1) {
        this.attributeListWithAllTypes.push(attribute);
      }
      if (type == 3) {   //decimal value
        const i = this.attributesChoiceUnitDescimal.findIndex((e: { unit: any; numeric_value: any; string_value: any; attribute: number; attribute_name: string; attribute_choice_name: any; }) => e.unit === attribute.unit && e.attribute === attribute.attribute && e.numeric_value === attribute.numeric_value && e.string_value === attribute.string_value && e.attribute_name == attribute.attribute_name && e.attribute_choice_name === attribute.attribute_choice_name);
        if (i == -1) {
          this.attributesChoiceUnitDescimal.push(attribute);
        }

        this.i = 0
        if (this.attributesChoiceUnitDescimal.length > 1 && this.product_attributes.controls[index].get('dataArray')?.value.length > 1) {
          this.attributesChoiceUnitDescimal.forEach((attribute: any) => {
            let temp_id = this.attributeListWithAllTypes.find((attributeData: any) => attributeData.unit == attribute.unit && attributeData.numeric_value == attribute.numeric_value && attributeData.attribute == attribute.attribute && attributeData.attribute_choice_name == attribute.attribute_choice_name).temp_id
            attribute.temp_id = temp_id
            this.attributesChoice.push(attribute)
          });
          this.setInventory(this.attributesChoice, false);
        }
      } else if (type == 1) {  //numeric_value
        const i = this.attributesChoiceUnitInteger.findIndex((e: { unit: any; numeric_value: any; string_value: any; attribute: number; attribute_name: string; attribute_choice_name: any; }) => e.unit === attribute.unit && e.attribute === attribute.attribute && e.numeric_value === attribute.numeric_value && e.string_value === attribute.string_value && e.attribute_name == attribute.attribute_name && e.attribute_choice_name === attribute.attribute_choice_name);
        if (i == -1) {
          this.attributesChoiceUnitInteger.push(attribute);
        }
        this.i = 0
        if (this.attributesChoiceUnitInteger.length > 1 && this.product_attributes.controls[index].get('dataArray')?.value.length > 1) {
          this.attributesChoiceUnitInteger.forEach((attribute: any) => {
            let temp_id = this.attributeListWithAllTypes.find((attributeData: any) => attributeData.unit == attribute.unit && attributeData.numeric_value == attribute.numeric_value && attributeData.attribute == attribute.attribute && attributeData.attribute_choice_name == attribute.attribute_choice_name).temp_id
            attribute.temp_id = temp_id
            this.attributesChoice.push(attribute)
          });
          this.setInventory(this.attributesChoice, false);
        }
      } else if (type == 22) {   // string_value
        const i = this.attributesChoiceUnitsString.findIndex((e: { unit: any; numeric_value: any; string_value: any; attribute: number; attribute_name: string; attribute_choice_name: any; }) => e.unit === attribute.unit && e.attribute === attribute.attribute && e.numeric_value === attribute.numeric_value && e.string_value === attribute.string_value && e.attribute_name == attribute.attribute_name && e.attribute_choice_name === attribute.attribute_choice_name);
        if (i == -1) {
          this.attributesChoiceUnitsString.push(attribute);
        }
        this.i = 0
        if (this.attributesChoiceUnitsString.length > 1 && this.product_attributes.controls[index].get('dataArray')?.value.length > 1) {
          this.attributesChoiceUnitsString.forEach((attribute: any) => {
            let temp_id = this.attributeListWithAllTypes.find((attributeData: any) => attributeData.unit == attribute.unit && attributeData.numeric_value == attribute.numeric_value && attributeData.attribute == attribute.attribute && attributeData.attribute_choice_name == attribute.attribute_choice_name).temp_id
            attribute.temp_id = temp_id
            this.attributesChoice.push(attribute)

          });
          this.setInventory(this.attributesChoice, false);
        }
      }
    });
  }

  addAttribute(index: number, id: number, name: string, type: number) {
    this.submitted[index] = true;
    const unitsGroup = this.form.group.get('product_attributes').at(index);
    if ((unitsGroup && unitsGroup.get('numeric_value').value != 0 && unitsGroup.get('numeric_value').value != null && !unitsGroup.get('numeric_value').hasError('min') && !unitsGroup.get('units').hasError('required')) || (unitsGroup && unitsGroup.get('decimal_value').value != 0 && unitsGroup.get('decimal_value').value != null && !unitsGroup.get('decimal_value').hasError('min') && !unitsGroup.get('units').hasError('required')) || (unitsGroup && unitsGroup.get('string_value').value != null && !unitsGroup.get('string_value').hasError('required') && !unitsGroup.get('units').hasError('required'))) {
      let isStringValue = this.product_attributes.controls[index].get('numeric_value')?.value != null && this.product_attributes.controls[index].get('numeric_value')?.value != 0 || (this.product_attributes.controls[index].get('decimal_value')?.value != null && this.product_attributes.controls[index].get('decimal_value')?.value != 0) ? false : true;
      let isInAttributeChoice;
      if (isStringValue) {
        isInAttributeChoice = this.attributesChoice.findIndex((e: { unit: any; numeric_value: any; string_value: any; attribute: number; attribute_name: string; attribute_choice_name: any; }) => e.unit == this.product_attributes.controls[index].get('units')?.value && e.attribute == id && e.string_value == this.product_attributes.controls[index].get('string_value')?.value && e.attribute_name == name)
      } else {
        isInAttributeChoice = this.attributesChoice.findIndex((e: { unit: any; numeric_value: any; string_value: any; attribute: number; attribute_name: string; attribute_choice_name: any; }) => e.unit == this.product_attributes.controls[index].get('units')?.value && e.attribute == id && e.numeric_value == this.product_attributes.controls[index].get('numeric_value')?.value && e.numeric_value == this.product_attributes.controls[index].get('decimal_value')?.value && e.attribute_name == name)
      }
      if (isInAttributeChoice == -1) {
        this.product_attributes.controls[index].get('dataArray')?.value.push(this.product_attributes.controls[index].get('numeric_value')?.value != null && this.product_attributes.controls[index].get('numeric_value')?.value != 0 ? this.product_attributes.controls[index].get('numeric_value')?.value + ' ' + this.product_attributes.controls[index].get('units')?.value : (this.product_attributes.controls[index].get('decimal_value')?.value != null && this.product_attributes.controls[index].get('decimal_value')?.value != 0 ? this.product_attributes.controls[index].get('decimal_value')?.value + ' ' + this.product_attributes.controls[index].get('units')?.value : this.product_attributes.controls[index].get('string_value')?.value + ' ' + this.product_attributes.controls[index].get('units')?.value))
        this.setUnits(index, name, id, isStringValue, type);
      }
      this.product_attributes.controls[index].get('numeric_value')?.setValue(0);
      this.product_attributes.controls[index].get('decimal_value')?.setValue(0);
      this.product_attributes.controls[index].get('string_value')?.setValue(null);
      this.product_attributes.controls[index].get('units')?.setValue('');
      this.submitted[index] = false;
    }
  }

  deleteAttribute(index: number, data: any, indexP: number) {
    this.product_attributes.controls[indexP].get('dataArray')?.value.splice(index, 1);
    let i: number = -1;
    let el: any;
    if (typeof data == 'object') {
      el = this.attributesChoice.find((el: any) => el.attribute_choice_name == data[0]);
      const currentValues = this.product_attributes.controls[indexP].get('attribute_size_scale')?.value as string[];
      const newValues = currentValues.filter((_, i) => i !== index);
      this.product_attributes.controls[index].get('attribute_size_scale')?.setValue(newValues)
    } else {
      el = this.attributesChoice.find((el: any) => el.attribute_choice_name == data)
    }
    if (el) {
      if (el?.type == 3) {   //decimal value
        this.attributesChoiceUnitDescimal.splice(this.attributesChoiceUnitDescimal.findIndex((el: any) => el.attribute_choice_name == data), 1);
      } else if (el?.type == 1) {    //numeric_value
        this.attributesChoiceUnitInteger.splice(this.attributesChoiceUnitInteger.findIndex((el: any) => el.attribute_choice_name == data), 1);
      }
      const filtredElements = this.attributesChoice.filter((att: any) => att.type && el.type && att.type == el.type);
      if (filtredElements.length <= 2) {
        filtredElements.forEach((element: any) => {
          this.attributesChoice.splice(this.attributesChoice.findIndex((el: any) => el.attribute_choice_name == element.attribute_choice_name), 1);
        });
      } else {
        this.attributesChoice.splice(this.attributesChoice.findIndex((el: any) => el.attribute_choice_name == data), 1);
      }
    }
    this.i = 0;
    this.attributeListWithAllTypes.splice(this.attributeListWithAllTypes.findIndex((el: any) => el.attribute_choice_name == data), 1);
    this.setInventory(this.attributesChoice, false);
    if (this.attributesChoice.length == 0) {
      this.combination = [];
      this.inventory.controls = [];
      this.isDerty = true;
      this.inventory.push(this.getInventoryForm())
    }
  }

  toggleBool(eventValue: string, id: number, name: string) {
    let attribute = {
      temp_id: this.attributeListWithAllTypes.length + 1,
      unit: null,
      numeric_value: null,
      string_value: null,
      attribute: id,
      attribute_name: name,
      boolean_value: eventValue,
      attribute_choice_name: eventValue
    }
    if (eventValue != '') {
      let indexAttr = this.attributeListWithAllTypes.findIndex((el: any) => (el.boolean_value == 'true' && el.attribute == id) || (el.boolean_value == 'false' && el.attribute == id));
      if (indexAttr != -1) {
        this.attributeListWithAllTypes.splice(indexAttr, 1);
      }
      this.attributeListWithAllTypes.push(attribute);
      this.i = 0
    } else {
      let indexAttr = this.attributeListWithAllTypes.findIndex((el: any) => el.attribute == id);
      this.attributeListWithAllTypes.splice(indexAttr, 1);
      this.i = 0
    }
  }

  hasError(index: number, field: string, errorType: string) {
    const unitsGroup = this.form.group.get('product_attributes').at(index);
    if (unitsGroup && unitsGroup.get(field).hasError(errorType)) {
      return true;
    }
    return false;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  toggleDelted(index: number) {
    if (this.inventory.controls[index].get('deleted')?.value) {
      this.inventory.controls[index].get('deleted')?.setValue(false)
    } else {
      this.inventory.controls[index].get('deleted')?.setValue(true)
      this.inventory.controls[index].get('default_price')?.setValue(null)
      this.inventory.controls[index].get('stock')?.setValue(null)
    }
    this.copieLastInventory = this.getCopieOfinventory();
  }

  integerValidator(control: FormControl) {
    if (control.value === null || control.value === '') {
      return null; // If the control is empty, consider it valid.
    }
    const pattern = /^\d+$/; // Regular expression to match whole numbers.
    if (pattern.test(control.value)) {
      return null; // It's a whole number, so it's valid.
    } else {
      return { notAnInteger: true }; // It's not a whole number, so return an error object.
    }
  }

  getCopieOfinventory() {
    if (this.combination && this.combination.length) {
      return this.combination.map((elements, index) => {
        return {
          combination: elements.map((el) => {
            return {
              attribute_name: el.attribute_name,
              attribute_choice_name: el.attribute_choice_name,
              temp_id: el.temp_id
            }
          }),
          default_price: this.form.group.get('inventory.' + index) != null ? this.form.group.get('inventory.' + index).get('default_price').value : null,
          default_price_currency: null,
          promotional_pricing: null,
          stock: this.form.group.get('inventory.' + index) != null ? this.form.group.get('inventory.' + index).get('stock').value : null,
          temp_combination: null,
          deleted: this.form.group.get('inventory.' + index) != null ? this.form.group.get('inventory.' + index).get('deleted').value : null
        };
      });
    }
    else return null
  }

  onDragStart(index: number) {
    this.dragIndex = index;
  }

  onDragOver(event: Event, index: number) {
    event.preventDefault();
  }

  onDrop(index: number) {
    if (this.dragIndex !== undefined) {
      const draggedItem = this.images.splice(this.dragIndex, 1)[0];
      const draggedItemFile = this.productImgsFiles.splice(this.dragIndex, 1)[0];
      this.images.splice(index, 0, draggedItem);
      this.productImgsFiles.splice(index, 0, draggedItemFile);
      this.productImgsFiles.map((el: { is_primary: boolean; ordering: number }) => el.is_primary = false)
      this.productImgsFiles.map((el: { is_primary: boolean; ordering: number }, index: any) => el.ordering = index)
      this.productImgsFiles[0].is_primary = true
      this.dragIndex = undefined;
    }
  }

  getProductAttributeByCategory(category: any) {
    this.attributesChoiceCurrentProduct = []
    this.product_attributes = this.form.group.get('product_attributes') as FormArray;
    this.inventory = this.form.group.get('inventory') as FormArray;
    this.productService.getProductAttributeFields(category).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
      const list = res.actions.GET
      this.listLabelScales = Object.keys(list.scales.child.children).filter((key: any) => list.scales.child.children[key].type == "string").map((key: string) => {
        return { key: key, label: list.scales.child.children[key].label };
      });
      for (const [key, value] of Object.entries(list)) {
        this.listFieldAttribute = [...this.listFieldAttribute, { key, value }];
      }
    });
    this.productService.getProductAttributeByCategory(category).pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      console.log('data', data);
      this.attributesChoices = data.filter((el: { type: number; choices: string | any[]; units: string | any[]; }) => el.choices.length > 0 && el.units.length == 0 && el.type == 20);
      let attributeBool = this.currentProduct.product_attributes.filter((attribute: any) => attribute.type == 2)
      let attributeChoiceInCurrentProduct = this.currentProduct.product_attributes.filter((attribute: any) => attribute.attribute_choice != null && attribute.type == 20)
      attributeChoiceInCurrentProduct.forEach((attribute: any) => {
        let attributeChoice = {
          temp_id: this.attributesChoiceCurrentProduct.length + 1,
          attribute: attribute.attribute,
          attribute_choice: attribute.attribute_choice,
          attribute_choice_name: attribute?.value,
          attribute_name: attribute.attribute_name,
          type: attribute.type
        }
        this.attributesChoiceChecked.push(attributeChoice);
        this.attributesChoiceCurrentProduct.push(attributeChoice);
      });
      for (let index = 0; index < this.attributesChoices.length; index++) {
        const attributeChoice = this.attributesChoices[index]
        const attributeChoiceInCurrentProductfiltred = attributeChoiceInCurrentProduct.filter((attribute: any) => attribute.attribute == attributeChoice.id)
        if (attributeChoiceInCurrentProductfiltred.length > 1) {
          attributeChoiceInCurrentProductfiltred.forEach((attribute: any) => {
            attributeChoice.choices.forEach((choice: any, i: number) => {
              if (choice.attribute == attribute.attribute && choice.id == attribute.attribute_choice) {
                this.attributesChoices[index].choices[i]['checked'] = true;
                let attributeCh = {
                  temp_id: this.attributeChoiceCuPr.length + 1,
                  attribute: attribute.attribute,
                  attribute_choice: attribute.attribute_choice,
                  attribute_choice_name: attribute?.value,
                  attribute_name: attributeChoice.name,
                  id: attribute.id,
                  type: attribute.type
                }
                this.attributeChoiceCuPr.push(attributeCh)
                this.attributeListWithAllTypes.push(attributeCh)
              }
            });
          });
          if (this.attributesChoices[index].choices.length > 0 && this.attributesChoices[index].units.length == 0 && this.attributesChoices[index].type == 20) {
            this.product_attributes.push(this.getAttributeForm());
          }
        } else {
          attributeChoiceInCurrentProductfiltred.forEach((attribute: any) => {
            attributeChoice.choices.forEach((choice: any, i: number) => {
              if (choice.attribute == attribute.attribute && choice.id == attribute.attribute_choice) {
                this.attributesChoices[index].choices[i]['checked'] = true;
                let attributeCh = {
                  temp_id: this.attributeChoiceCuPr.length + 1,
                  attribute: attribute.attribute,
                  attribute_choice: attribute.attribute_choice,
                  attribute_choice_name: attribute?.value,
                  attribute_name: attributeChoice.name,
                  id: attribute.id,
                  type: attribute.type
                }
                this.attributeListWithAllTypes.push(attributeCh)
              }
            });
          });
          if (this.attributesChoices[index].choices.length > 0 && this.attributesChoices[index].units.length == 0 && this.attributesChoices[index].type == 20) {
            this.product_attributes.push(this.getAttributeForm());
          }
        }
      }
      this.attributesUnits = data.filter((el: { choices: string | any[]; scales: string | any[]; units: string | any[]; type: number }) => (el.choices.length == 0 && el.units.length > 0 && (el.type == 3 || el.type == 1)) || (el.scales.length > 0 && el.type == 22));
      this.scales = this.attributesUnits.filter((attr: any) => attr.type == 22);
      this.scalesValue = this.scales[0]?.scales.reduce((acc: { [x: string]: any[]; }, item: { [x: string]: any; }) => {
        Object.keys(item).forEach(key => {
          if (!acc[key] && key != 'attribute' && key != 'id' && item[key] != '') {
            acc[key] = [];
          }
          acc[key]?.push([item[key], item['id'], item['attribute']]);
        });
        return acc;
      }, {});
      this.listLabelScales.forEach((scale: any, index: number) => {
        if (this.scalesValue && !this.scalesValue[scale.key]) {
          this.listLabelScales.splice(index, 1)
        }
      });
      let attributeUnitsInCurrentProduct = this.currentProduct.product_attributes.filter((attribute: any) => (attribute.unit != null && (attribute.type == 3 || attribute.type == 1)) || (attribute.type == 22))
      let activeAttributeScales: any = []
      for (let index = 0; index < this.attributesUnits.length; index++) {
        if (this.attributesUnits[index].choices.length == 0 && this.attributesUnits[index].units.length > 0 && (this.attributesUnits[index].type == 3 || this.attributesUnits[index].type == 22)) {
          this.product_attributes.push(this.getAttributeForm());
        }
        attributeUnitsInCurrentProduct.forEach((currentUntis: any) => {
          if (currentUntis.type == 22 && this.scalesValue[currentUntis.string_value]) {
            let element = this.scalesValue[currentUntis.string_value].find((scale: any) => scale[1] == currentUntis.attribute_size_scale)
            element[3] = currentUntis.id;
            activeAttributeScales.push(element)
            this.product_attributes.controls[index]?.get('string_value')?.setValue(currentUntis.string_value)
            this.activeScale = this.scalesValue[currentUntis.string_value];

          }
          this.attributesUnits[index].units.forEach((unit: any) => {
            if (currentUntis.attribute == unit.attribute && currentUntis.unit == unit.unit) {
              if (currentUntis.type == 1) {
                this.product_attributes.controls[index]?.get('dataArray')?.value.push(currentUntis.numeric_value + ' ' + currentUntis.unit)
                this.product_attributes.controls[index]?.get('units_copy')?.setValue(currentUntis.unit)
                this.product_attributes.controls[index]?.get('numeric_value_copy')?.setValue(currentUntis.numeric_value)
              } else if (currentUntis.type == 3) {
                this.product_attributes.controls[index]?.get('dataArray')?.value.push(currentUntis.numeric_value + ' ' + currentUntis.unit)
                this.product_attributes.controls[index]?.get('units_copy')?.setValue(currentUntis.unit)
                this.product_attributes.controls[index]?.get('decimal_value_copy')?.setValue(currentUntis.numeric_value)
              }
            }
          });
        });
        const filtredAttributeUnitsInCurrentProduct = attributeUnitsInCurrentProduct.filter((attribute: any) => attribute.type == this.attributesUnits[index].type && attribute.attribute == this.attributesUnits[index].id)
        filtredAttributeUnitsInCurrentProduct.forEach((currentUntis: any) => {
          this.attributesUnits[index].units.forEach((unit: any) => {
            if (currentUntis.attribute == unit.attribute && currentUntis.unit == unit.unit) {
              let attributeUnit = {
                temp_id: this.attributeChoiceCuPr.length + 1,
                unit: currentUntis.unit,
                numeric_value: currentUntis.numeric_value,
                string_value: currentUntis.translations && currentUntis.translations.en.string_value != null ? currentUntis.translations.en.string_value : null,
                attribute: currentUntis.attribute,
                attribute_choice_name: currentUntis.numeric_value != null ? currentUntis.numeric_value + ' ' + currentUntis.unit : currentUntis.translations.en.string_value + ' ' + currentUntis.unit,
                attribute_name: this.attributesUnits[index].name,
                id: currentUntis.id,
                type: currentUntis.type
              }
              if (filtredAttributeUnitsInCurrentProduct.length > 1) {
                this.attributesChoiceCurrentProduct.push(attributeUnit);
                this.attributeChoiceCuPr.push(attributeUnit)
              }
              attributeUnit.temp_id = this.attributeListWithAllTypes.length + 1
              this.attributeListWithAllTypes.push(attributeUnit);
            }
          });
        });
        if (activeAttributeScales.length > 0) {
          this.product_attributes.controls[index]?.get('attribute_size_scale')?.setValue(activeAttributeScales)
          this.product_attributes.controls[index]?.get('dataArray')?.setValue(activeAttributeScales)
          activeAttributeScales.forEach((value: any) => {
            let attribute = {
              temp_id: this.attributeChoiceCuPr.length + 1,
              unit: null,
              numeric_value: null,
              string_value: this.product_attributes.controls[index].get('string_value')?.value,
              attribute: value[2],
              attribute_name: this.attributesUnits[index].name,
              attribute_choice_name: value[0],
              type: 22,
              id: value[3],
              attribute_size_scale: value[1]
            }
            const filtredAttributeScalesInCurrentProduct = attributeUnitsInCurrentProduct.filter((attribute: any) => attribute.type == 22)
            if (filtredAttributeScalesInCurrentProduct.length > 1) {
              this.attributeChoiceCuPr.push(attribute)
            }
            if (this.attributeListWithAllTypes.findIndex((attr: any) => attr.attribute_choice_name == attribute.attribute_choice_name && attr.attribute_size_scale == attribute.attribute_size_scale) == -1) {
              this.attributeListWithAllTypes.push(attribute);
            }
          });
        }
      }
      this.attributesBool = data.filter((el: { choices: string | any[]; units: string | any[]; type: number }) => el.type == 2);
      if (attributeBool.length) {
        this.product_attributes.controls[this.product_attributes.controls.length - 1]?.get('boolean_value')?.setValue(attributeBool[0].value.toLowerCase())
      }
      const arrayCombin: any = [];
      const combinations: any = [];
      this.currentProduct.inventory.forEach((inventory: any, i: number) => {
        inventory.combination.forEach((combination: any, index: number) => {
          if (combination.unit != null && combination.type == 3) {
            this.attributesUnits.forEach((unit: any) => {
              if (unit.id == combination.attribute && arrayCombin.filter((combi: any) => combi.unit == combination.unit && combi.attribute_name == unit.name && combi.attribute_choice_name == combination.numeric_value + ' ' + combination.unit && combi.numeric_value == combination.numeric_value).length == 0) {
                arrayCombin.push({ temp_id: arrayCombin.length + 1, unit: combination.unit, attribute_name: unit.name, attribute_choice_name: combination.numeric_value + ' ' + combination.unit, numeric_value: combination.numeric_value })
              }
            });
          } else if (combination.unit != null && combination.type == 1) {
            this.attributesUnits.forEach((unit: any) => {
              if (unit.id == combination.attribute && arrayCombin.filter((combi: any) => combi.unit == combination.unit && combi.attribute_name == unit.name && combi.attribute_choice_name == combination.numeric_value + ' ' + combination.unit && combi.numeric_value == combination.numeric_value).length == 0) {
                arrayCombin.push({ temp_id: arrayCombin.length + 1, unit: combination.unit, attribute_name: unit.name, attribute_choice_name: combination.numeric_value + ' ' + combination.unit, numeric_value: combination.numeric_value })
              }

            });
          } else if (combination.unit != null && combination.type == 22) {
            this.attributesUnits.forEach((unit: any) => {
              if (unit.id == combination.attribute && arrayCombin.filter((combi: any) => combi.unit == combination.unit && combi.attribute_name == unit.name && combi.attribute_choice_name == combination.translations.en.string_value + ' ' + combination.unit && combi.string_value == combination.translations.en.string_value).length == 0) {
                arrayCombin.push({ temp_id: arrayCombin.length + 1, unit: combination.unit, attribute_name: unit.name, attribute_choice_name: combination.translations.en.string_value + ' ' + combination.unit, string_value: combination.translations.en.string_value })
              }
            });
          }
        });
        this.inventory.push(this.getInventoryForm())
        if (arrayCombin.length) {
          combinations.push(arrayCombin)
        }
      });
      this.attributesChoice = this.attributeChoiceCuPr;
      this.combination = this.arrayToComibination(this.attributeChoiceCuPr);
      this.combination.sort((a, b) => {
        const scaleA = a[0].attribute_size_scale;
        const scaleB = b[0].attribute_size_scale;
        return scaleA - scaleB;
      });
      for (let index = this.inventory.controls.length; index < this.combination.length; index++) {
        this.inventory.push(this.getInventoryForm());
      }
      if (this.currentProduct.inventory.length == 1 && !this.currentProduct.inventory[0].combination.length) {
        this.inventory.controls[0].get('default_price')?.setValue(this.currentProduct.inventory[0].default_price)
        this.inventory.controls[0].get('stock')?.setValue(this.currentProduct.inventory[0].stock)
      } else {
        this.inventory.controls.forEach((element: any, index: number) => {
          this.inventory.controls[index].get('deleted')?.setValue(true)
        });
        const combination = this.currentProduct.inventory.map((inventory: any) => {
          if (inventory.combination.length) {
            return inventory.combination.map((combi: any) => {
              if (this.attributesList.find((el: { id: any; }) => el.id == combi).type != 2) {
                return {
                  attribute_name: this.attributesList.find((el: { id: any; }) => el.id == combi).attribute_name,
                  attribute_choice: this.attributesList.find((el: { id: any; }) => el.id == combi).attribute_choice,
                  attribute: this.attributesList.find((el: { id: any; }) => el.id == combi).attribute,
                  attribute_size_scale: null,
                  boolean_value: null,
                  numeric_value: this.attributesList.find((el: { id: any; }) => el.id == combi).numeric_value,
                  string_value: this.attributesList.find((el: { id: any; }) => el.id == combi).translations && this.attributesList.find((el: { id: any; }) => el.id == combi).translations.en.string_value != null ? this.attributesList.find((el: { id: any; }) => el.id == combi).translations.en.string_value : null,
                  unit: this.attributesList.find((el: { id: any; }) => el.id == combi).unit,
                  attribute_choice_name: this.attributesList.find((el: { id: any; }) => el.id == combi).unit != null && this.attributesList.find((el: { id: any; }) => el.id == combi).numeric_value != null ? this.attributesList.find((el: { id: any; }) => el.id == combi).numeric_value + ' ' + this.attributesList.find((el: { id: any; }) => el.id == combi).unit : (this.attributesList.find((el: { id: any; }) => el.id == combi).unit != null && this.attributesList.find((el: { id: any; }) => el.id == combi).translations.en.string_value != null ? this.attributesList.find((el: { id: any; }) => el.id == combi).translations.en.string_value + ' ' + this.attributesList.find((el: { id: any; }) => el.id == combi).unit : this.attributesList.find((el: { id: any; }) => el.id == combi).value),
                  id: this.attributesList.find((el: { id: any; }) => el.id == combi).id
                }
              } else {
                return {
                  attribute_name: this.attributesList.find((el: { id: any; }) => el.id == combi).attribute_name,
                  attribute_choice: this.attributesList.find((el: { id: any; }) => el.id == combi).attribute_choice,
                  attribute: this.attributesList.find((el: { id: any; }) => el.id == combi).attribute,
                  attribute_size_scale: null,
                  boolean_value: null,
                  numeric_value: null,
                  string_value: null,
                  unit: this.attributesList.find((el: { id: any; }) => el.id == combi).unit,
                  attribute_choice_name: this.attributesList.find((el: { id: any; }) => el.id == combi).value.toLowerCase(),
                  id: this.attributesList.find((el: { id: any; }) => el.id == combi).id
                }
              }
            });
          }
        })
        const oldCombination = this.combination.map((combinations: any) => {
          return combinations.map((combi: any) => {
            return {
              attribute_name: combi.attribute_name,
              attribute_choice: combi.attribute_choice ? combi.attribute_choice : null,
              attribute: combi.attribute,
              attribute_size_scale: null,
              boolean_value: null,
              numeric_value: combi.numeric_value ? combi.numeric_value : null,
              string_value: combi.string_value ? combi.string_value : null,
              unit: combi.unit ? combi.unit : null,
              attribute_choice_name: combi.attribute_choice_name,
              id: combi.id
            }
          })
        })

        const combinationFiltred = combination.filter((item: any) => item !== undefined)
        const combin = combinationFiltred.map((innerArray: any) => innerArray.filter((item: any) => item !== undefined));
        const combi = this.orderArrayOfObjet(combin);
        const combi2 = this.orderArrayOfObjet(oldCombination, combi);
        if (combi != undefined) {
          const combAttributeNumber2 = combi2?.map((combinations: any) => {
            return combinations.map((combi: any) => { return combi.id });
          })
          let inventoryIndex: any = [];
          for (let index = 0; index < combAttributeNumber2?.length; index++) {
            this.currentProduct.inventory.forEach((inventory: any) => {
              let arraysEqual = inventory.combination.length === combAttributeNumber2[index].length && inventory.combination.every((value: any, i: number) => combAttributeNumber2[index].includes(value));
              if (arraysEqual) {
                this.inventory.controls[index].get('deleted')?.setValue(false)
                inventoryIndex.push(index)
              }
            });
          }
          for (let i = 0; i < inventoryIndex.length; i++) {
            const element = inventoryIndex[i];
            this.inventory.controls[element].get('default_price')?.setValue(this.currentProduct.inventory[i].default_price)
            this.inventory.controls[element].get('stock')?.setValue(this.currentProduct.inventory[i].stock)
          }
        }
      }
    });
  }

  arrayToComibination(arrayCombin: any) {
    const groupedMap = arrayCombin.reduce((entryMap: any, e: any) => entryMap.set(e.attribute_name, [...entryMap.get(e.attribute_name) || [], e]), new Map());
    let array = [...groupedMap.values()];
    return this.generateCombinations(array);
  }

  orderArrayOfObjet(arrayOfObjects: any, orderLis?: any) {
    if (arrayOfObjects.length) {
      const keys = orderLis ? (orderLis[0][0].attribute
        ? orderLis[0].map((obj: any) => obj.attribute)
        : Object.keys(orderLis[0][0])) : (arrayOfObjects[0][0].attribute
          ? arrayOfObjects[0].map((obj: any) => obj.attribute)
          : Object.keys(arrayOfObjects[0][0]));
      if (arrayOfObjects.every((arr: any) => arr.length > 0)) {
        const sortObjectsByAttributeOrder = (objects: any) => {
          return objects.sort((a: { attribute: any; }, b: { attribute: any; }) => {
            const indexA = keys.indexOf(a.attribute);
            const indexB = keys.indexOf(b.attribute);
            return indexA - indexB;
          });
        };
        return arrayOfObjects.map(sortObjectsByAttributeOrder);
      }
    }
  }

  doesArrayExist(array: any, target: any) {
    for (let i = 0; i < array.length; i++) {
      if (this.compareArrays(array[i], target))
        return true; // Target array exists in the current line
    }
    return false; // Target array not found in any line
  }

  compareArrays(arr1: any, arr2: any) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let k = 0; k < arr1.length; k++) {
      if (arr1[k] !== arr2[k]) {
        return false;
      }
    }
    return true;
  }

  enabledInventory(index: number) {
    if (this.inventory.controls[index].get('deleted')?.value)
      this.inventory.controls[index].get('deleted')?.setValue(false)
  }

  setScalesValue(key: string, index: number) {
    this.attributesChoice.forEach((attribute: any, index: number) => {
      if (attribute.type == 22) {
        this.attributesChoice.splice(index, 1)
      }
    });
    this.attributeListWithAllTypes.forEach((attribute: any, index: number) => {
      if (attribute.type == 22) {
        this.attributeListWithAllTypes.splice(index, 1)
      }
    });
    this.activeScale = this.scalesValue[key];
    this.product_attributes.controls[index].get('string_value_copy')?.setValue(this.listLabelScales.find((el: any) => el.key == key).label)
  }

  setScalesAttributeId(values: any, index: number, attributeData: any) {
    this.attributesChoice.forEach((attributeChoice: any, index: number) => {
      if (attributeChoice.string_value != this.product_attributes.controls[index].get('string_value')?.value && attributeChoice.type == 22) {
        this.attributesChoice.splice(index, 1)
      }
    });
    this.attributeListWithAllTypes.forEach((attribute: any, index: number) => {
      if (attribute.string_value != this.product_attributes.controls[index].get('string_value')?.value && attribute.type == 22) {
        this.attributeListWithAllTypes.splice(index, 1)
      }
    });
    let scalesAttribute = this.attributesChoice.filter((attr: any) => attr.type == 22);
    let scalesAttributeFromAll = this.attributeListWithAllTypes.filter((attr: any) => attr.type == 22);
    if (scalesAttributeFromAll.length > values.length) {
      scalesAttributeFromAll.forEach((attr: any, index: number) => {
        let indexVal = values.findIndex((val: any) => attr.attribute_choice_name == val[0] && attr.attribute_size_scale == val[1]);
        if (indexVal != -1) {
          if (values.length < 2) {
            this.attributesChoice.forEach((attr: any, index: number) => {
              if (attr.type == 22) {
                this.attributesChoice.splice(index, 1)
              }
            });
          }
        } else {
          console.log('here indexVal 2', indexVal)
          let indexOriginData = this.attributeListWithAllTypes.findIndex((attr: any) => attr == scalesAttributeFromAll[index])
          if (this.attributeListWithAllTypes[indexOriginData].type == 22) {
            this.attributeListWithAllTypes.splice(indexOriginData, 1)
          }
        }
      });
    } else {
      values.forEach((val: any) => {
        let indexAttr = this.attributeListWithAllTypes.findIndex((attr: any) => attr.attribute_choice_name == val[0] && attr.attribute_size_scale == val[1])
        if (indexAttr == -1) {
          let attribute: any = {
            temp_id: this.attributeListWithAllTypes.length ? this.attributeListWithAllTypes[this.attributeListWithAllTypes.length - 1].temp_id + 1 : this.attributeListWithAllTypes.length + 1,
            unit: null,
            numeric_value: null,
            string_value: this.product_attributes.controls[index].get('string_value')?.value,
            attribute: attributeData.id,
            attribute_name: this.product_attributes.controls[index].get('string_value_copy')?.value,
            attribute_choice_name: val[0],
            type: 22,
            attribute_size_scale: val[1]
          }
          this.attributeListWithAllTypes.push(attribute)
        }
      });
    }

    if (scalesAttribute.length > values.length) { // scales attribute choice
      scalesAttribute.forEach((attr: any, index: number) => {
        let indexVal = values.findIndex((val: any) => attr.attribute_choice_name == val[0] && attr.attribute_size_scale == val[1]);
        if (indexVal != -1) {
          if (values.length < 2) {
            this.attributesChoice.forEach((attribute: any, index: number) => {
              if (attribute.type == 22)
                this.attributesChoice.splice(index, 1)
            });
          }
        }
        else {
          console.log('here indexVal 2', indexVal)
          let indexOriginData = this.attributesChoice.findIndex((attr: any) => attr == scalesAttribute[index])
          if (this.attributesChoice[indexOriginData].type == 22) {
            this.attributesChoice.splice(indexOriginData, 1)
          }
        }
      });
    } else {
      values.forEach((val: any) => {
        let indexAttr = this.attributesChoice.findIndex((attr: any) => attr.attribute_choice_name == val[0] && attr.attribute_size_scale == val[1]);
        let indexInAllAttribute = this.attributeListWithAllTypes.findIndex((attr: any) => attr.attribute_choice_name == val[0] && attr.attribute_size_scale == val[1]);
        if (indexAttr == -1) {
          let attribute: any = {
            temp_id: this.attributeListWithAllTypes[indexInAllAttribute].temp_id,
            unit: null,
            numeric_value: null,
            string_value: this.product_attributes.controls[index].get('string_value')?.value,
            attribute: attributeData.id,
            attribute_name: this.product_attributes.controls[index].get('string_value_copy')?.value,
            attribute_choice_name: val[0],
            type: 22,
            attribute_size_scale: val[1]
          }
          if (values.length > 1) {
            this.attributesChoice.push(attribute)
          }
        }
      });
    }
    this.product_attributes.controls[index].get('dataArray')?.setValue(values);
    this.setInventory(this.attributesChoice);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}