import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, combineLatest, takeUntil } from 'rxjs';
import { Description, Translation, OwnTerms, TranslationTerms } from 'src/@core/models/dispute';
import { FormGeneric } from 'src/@core/models/form-generic';
import { SHOP_INFOS } from 'src/@core/models/form.model';
import { Shop } from 'src/@core/models/shop';
import { CreateWallet } from 'src/@core/models/wallet';
import { ShopService } from 'src/@core/services/shop.service';
import { TranslateDataService } from 'src/@core/services/translateData.service';
import { UserService } from 'src/@core/services/user.service';
import { WalletService } from 'src/@core/services/wallet.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import _ from 'lodash';

@Component({
  selector: 'app-second-step',
  templateUrl: './second-step.component.html',
  styleUrls: ['./second-step.component.scss']
})
export class SecondStepComponent implements OnInit, OnChanges, OnDestroy {
  @Input() shopCurrent: any;
  @Input() newImgChange: any;
  @Input() languageProfile: any;
  @Input() createMode: boolean = true;

  @Output() SecondStepFormShared: EventEmitter<any> = new EventEmitter();
  @Output() CurrencyShared: EventEmitter<any> = new EventEmitter();
  @Output() accessSecondStep: EventEmitter<number> = new EventEmitter();
  @Output() previous: EventEmitter<string> = new EventEmitter();

  public profileSub: Subscription;
  listCur: any[] = []
  errors: any = [];
  currencies: any = [] as any;
  listField: any = [];
  listFieldSecond: any = [];
  addressfileds: any = [] as any[];
  termsfileds: any = [] as any[];
  ambassadorFileds: any = [] as any[];
  newListFieldsSorting: any = [] as any[];
  form: FormGeneric = new FormGeneric(this.fb);
  languageShowedForUser = '';
  countryList: any = [] as any[];
  file: any;
  formData = new FormData();
  logoShop: any;
  bannerShop: any;
  shop = {} as Shop;
  formStore = {} as any;
  formTerms = {} as any;
  items: any[] = [];
  submitFormCheck = false;
  createShopObj = {} as any;
  defaultCurrency: any;
  newDefaultCurrency: any;
  currencyErrors: any = [];
  createWallet: CreateWallet = { currency: "eur" };
  arrTranslate: any = [];
  idShopCurrent: number = 0;
  editMode = false;
  showLoader = false;
  isSubscribedToEmailsMessage: any;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private walletService: WalletService,
    private shopService: ShopService,
    private translateDataService: TranslateDataService,
    private settingsService: RegionalSettingsService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private translate: TranslateService,
    private userService: UserService,
    private spinner: NgxSpinnerService
  ) {
    this.form.group = this.fb.group(SHOP_INFOS);
  }

  ngOnChanges(): void {
    if (this.newImgChange) {
      this.updateLogoShop(this.newImgChange);
      delete this.newImgChange;
    }

    this.idShopCurrent = this.shopCurrent?.id;

    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }

    if (!this.languageProfile) {
      this.profileSub = this.userService.profile$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
          if (data) {
            this.languageProfile = data._language;
          }
        });
    }
  }

  ngOnInit(): void {
    this.refreshData();
    this.settingsService.listCurrencies$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.listCur = data;
      })

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (settings: any) => {
          if (settings?.language) {
            this.refreshData();
          }
        }
      });
  }

  updateLogoShop(logo: any): any {
    this.formData = new FormData();
    this.formData.append('logo', logo);
    this.errors = [];
    this.logoShop = logo;
    let shop = this.prepareShop();
    delete shop.banner;
    this.shopService.patchShopById(this.prepareProfilewithPicture(shop), this.idShopCurrent)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: data => {
          if (data) {
            this.toaster.success(this.translate.instant('boutique.edit_shop'));
          }
        },
        error: (err) => {
          if (err.status === 400) {
            this.errors = [];
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
              this.scrollToEl(this.errors[0]);
            }
          } else if (err.status === 500) {
            this.toaster.error(this.translate.instant('boutique.error_500'));
          }
        }
      });
  }

  refreshData(): any {
    this.listField = [];
    this.addressfileds = [];
    this.termsfileds = [];
    this.newListFieldsSorting = [];
    this.currencies = [];
    this.ambassadorFileds = [];
    this.errors = [];
    this.checkCurrency();
  }

  checkCurrency(): any {
    this.walletService.walet$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (data) => {
          if (data) {
            localStorage.setItem('user_currency', data?.balance_currency ?? '');
            this.getShopFlields(data);
          }
        },
        error: (err) => {
          if (err.status === 403 || err.status === 405) {
            this.getShopFlields(null);
          }
        }
      });
  }

  getShopFlields(dataCurrency: any): any {
    this.shopService.getShopInfos()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((fields) => {
        const list = fields.actions.POST;
        this.listField = [];
        for (const [key, value] of Object.entries(list)) {
          this.listField = [...this.listField, { key, value }];
        }

        this.listField = this.listField.filter((field: any) =>
          field.key === 'shop_address' || field.key === 'send_email' || field.key === 'currency' || field.key === 'ambassador' ||
          field.key === 'description' || field.key === 'terms' || field.key === 'name' || field.key === 'banner' || field.key === 'logo' || field.key === 'www' || field.key === 'instagram' || field.key === 'facebook' || field.key === 'keywords' || field.key === 'maintenance_mode');
        this.listField.forEach((element: any) => {
          if (element.key === 'name') {
            element.index = 0;
          } else if (element.key === 'description') {
            element.index = 3;
          }
          else if (element.key === 'maintenance_mode') {
            element.index = 8;
          } else if (element.key === 'logo') {
            element.index = 1;
          } else if (element.key === 'banner') {
            element.index = 2;
          } else if (element.key === 'www') {
            element.index = 5;
          } else if (element.key === 'facebook') {
            element.index = 6;
          } else if (element.key === 'instagram') {
            element.index = 7;
          }
          else if (element.key === 'keywords') {
            element.index = 4;
          } else if (element.key === 'terms') {
            element.index = 9;
            const choices = element.value.children;
            for (const [key, value] of Object.entries(choices)) {
              this.termsfileds = [...this.termsfileds, { key, value }];
              this.termsfileds = this.termsfileds.filter((field: any) => field.value.read_only !== true && field.key !== 'shop' && field.key !== 'id');
            }
            this.termsfileds.forEach((field: any) => {
              this.form.group.get('terms')?.get(field.key)?.setValue(field.value.default);
            });
          } else if (element.key === 'shop_address') {
            element.index = 10;
            const choices = element.value.children;
            for (const [key, value] of Object.entries(choices)) {
              this.addressfileds = [...this.addressfileds, { key, value }];
              this.addressfileds = this.addressfileds.filter((field: any) => field.value.read_only !== true && field.key !== 'name_ext'
                && field.key !== 'company_name' && field.key !== 'longitude' && field.key !== 'latitude' && field.key !== 'id');
              this.addressfileds.forEach((field: any) => {
                if (field.key === 'country') {
                  this.countryList = field.value.choices;
                }
              });
            }
          } else if (element.key === 'currency') {
            element.index = 11;
            element.value.choices = this.listCur;
            if (dataCurrency && dataCurrency.balance_currency) {

              element.value?.choices?.forEach((choose: any) => {
                if (dataCurrency.balance_currency === choose.value) {
                  this.defaultCurrency = dataCurrency.balance_currency;
                  this.currencies.push(element);
                }
              });
            } else {
              this.currencies.push(element);
            }
          } else if (element.key === 'ambassador') {
            element.index = 12;
            this.ambassadorFileds.push(element);
          }
        });
        this.currencies = [...this.currencies]
        this.newListFieldsSorting = this.listField.sort((a: any, b: any) => a.index - b.index);
      });
  }

  handlerFormStoreShared(value: any): any {
    this.formStore.description = value.description;
    this.formStore.keywords = value.keywords;
    this.formStore.translate = value.translate;
    this.formStore.form = value.form;
    this.logoShop = value.logo;
    this.bannerShop = value.banner;
  }

  handlerFormWalletShared(value: any): any {
    this.newDefaultCurrency = value;
  }

  handlerFormAddressShopShared(value: any): any {
    this.createShopObj.shop_address = value;
  }

  handlerFormTermsShared(value: any): any {
    this.createShopObj.terms = value.formTerms;
    this.formTerms.form = value.formTerms;
    this.formTerms.translate = value.translate;
    this.formTerms.own_terms = value.own_terms;
  }

  handlerformAmbassadorShared(value: any): any {
    this.createShopObj.ambassador = value.ambassador;
  }

  nextStep(): any {
    this.saveAndContinue();
  }

  previousStep(): any {
    this.previous.emit();
  }

  saveAndContinue(): any {
    this.errors = [];
    this.spinner.show();
    this.submitFormCheck = true;

    setTimeout(() => {
      this.prepareTranslation();
    }, 100);

    if (!this.defaultCurrency) {
      if (_.isEmpty(this.newDefaultCurrency)) {
        this.currencyErrors = [
          {
            currency: this.translate.instant('message_empty.empty_field')
          }
        ];
      } else {
        this.currencyErrors = [];
        this.CurrencyShared.emit(this.newDefaultCurrency);
      }
    }
  }

  prepareTranslation(): any {
    this.arrTranslate = [];
    if (!this.editMode) {
      if (
        _.isEmpty(this.formStore?.form?.description) == true
        && _.isEmpty(this.formStore?.form?.keywords) == true
        && _.isEmpty(this.formTerms?.form?.own_terms) == true) {
        this.createShop();
      } else {
        if (this.formStore.translate && this.formTerms.translate) {
          if (this.languageProfile === 'en') {
            if (this.formStore.form.description) {
              this.arrTranslate.push({ language: 'fr', text: this.formStore.form.description, description: 'description' });
            }
            if (this.formStore.form.keywords) {
              this.arrTranslate.push({ language: 'fr', text: this.formStore.form.keywords, keywords: 'keywords' });
            }
            if (this.formTerms.form.own_terms) {
              this.arrTranslate.push({ language: 'fr', text: this.formTerms.form.own_terms, own_terms: 'own_terms' });
            }
            combineLatest(
              this.translateDataService.translate(this.arrTranslate)
            ).subscribe(
              (docs: any) => {
                docs.forEach((doc: any, i: number) => {
                  this.arrTranslate?.forEach((item: any, j: number) => {
                    if (i === j) {
                      item.doc = doc.translation;
                    }
                  });
                });
                this.createShop();
              }, (err: any) => {
                this.spinner.hide();
              }
            )
          } else {
            if (this.formStore.form.description) {
              this.arrTranslate.push({ language: 'en', text: this.formStore.form.description, description: 'description' });
            }
            if (this.formStore.form.keywords) {
              this.arrTranslate.push({ language: 'en', text: this.formStore.form.keywords, keywords: 'keywords' });
            }
            if (this.formTerms.form.own_terms) {
              this.arrTranslate.push({ language: 'en', text: this.formTerms.form.own_terms, own_terms: 'own_terms' });
            }
            combineLatest(
              this.translateDataService.translate(this.arrTranslate)
            ).subscribe(
              (docs: any) => {
                docs.forEach((doc: any, i: number) => {
                  this.arrTranslate?.forEach((item: any, j: number) => {
                    if (i === j) {
                      item.doc = doc.translation;
                    }
                  });
                });
                this.createShop();
              }, (err: any) => {
                this.spinner.hide();
              }
            );
          }
        } else if (this.formStore.translate && !this.formTerms.translate) {
          if (this.languageProfile === 'en') {
            if (this.formStore.form.description) {
              this.arrTranslate.push({ language: 'fr', text: this.formStore.form.description, description: 'description' });
            }
            if (this.formStore.form.keywords) {
              this.arrTranslate.push({ language: 'fr', text: this.formStore.form.keywords, keywords: 'keywords' });
            }
            combineLatest(
              this.translateDataService.translate(this.arrTranslate)
            ).subscribe(
              (docs: any) => {
                docs.forEach((doc: any, i: number) => {
                  this.arrTranslate?.forEach((item: any, j: number) => {
                    if (i === j) {
                      item.doc = doc.translation;
                    }
                  });
                });
                this.createShop();
              }, (err: any) => {
                this.spinner.hide();
              }
            );
          } else {
            if (this.formStore.form.description) {
              this.arrTranslate.push({ language: 'en', text: this.formStore.form.description, description: 'description' });
            }
            if (this.formStore.form.keywords) {
              this.arrTranslate.push({ language: 'en', text: this.formStore.form.keywords, keywords: 'keywords' });
            }
            combineLatest(
              this.translateDataService.translate(this.arrTranslate)
            ).subscribe(
              (docs: any) => {
                docs.forEach((doc: any, i: number) => {
                  this.arrTranslate?.forEach((item: any, j: number) => {
                    if (i === j) {
                      item.doc = doc.translation;
                    }
                  });
                });
                this.createShop();
              }, (err: any) => {
                this.spinner.hide();
              }
            );
          }
        } else if (!this.formStore.translate && this.formTerms.translate) {
          if (this.languageProfile === 'en') {
            if (this.formTerms.form.own_terms) {
              this.arrTranslate.push({ language: 'fr', text: this.formTerms.form.own_terms, own_terms: 'own_terms' });
            }
            combineLatest(
              this.translateDataService.translate(this.arrTranslate)
            ).subscribe(
              (docs: any) => {
                docs.forEach((doc: any, i: number) => {
                  this.arrTranslate?.forEach((item: any, j: number) => {
                    if (i === j) {
                      item.doc = doc.translation;
                    }
                  });
                });
                this.createShop();
              }, (err: any) => {
                this.spinner.hide();
              }
            );
          } else {
            if (this.formTerms.form.own_terms) {
              this.arrTranslate.push({ language: 'en', text: this.formTerms.form.own_terms, own_terms: 'own_terms' });
            }
            combineLatest(
              this.translateDataService.translate(this.arrTranslate)
            ).subscribe(
              (docs: any) => {
                docs.forEach((doc: any, i: number) => {
                  this.arrTranslate?.forEach((item: any, j: number) => {
                    if (i === j) {
                      item.doc = doc.translation;
                    }
                  });
                });
                this.createShop();
              }, (err: any) => {
                this.spinner.hide();
              }
            );
          }
        } else {
          this.createShop();
        }
      }
    } else {
      if (this.formStore.translate && this.formTerms.translate) {
        if (this.languageProfile === 'en') {
          if (JSON.parse(localStorage.getItem('currentShop') || '{}').translations.en && (this.formStore.form.description != JSON.parse(localStorage.getItem('currentShop') || '{}').translations.en.description) && this.formStore.form.description != '') {
            this.arrTranslate.push({ language: 'fr', text: this.formStore.form.description, description: 'description' });
          }
          if (JSON.parse(localStorage.getItem('currentShop') || '{}').translations.en && (this.shopCurrent.translations.en.keywords != JSON.parse(localStorage.getItem('currentShop') || '{}').translations.en.keywords) && this.shopCurrent.translations.en.keywords != '') {
            this.arrTranslate.push({ language: 'fr', text: this.shopCurrent.translations.en.keywords, keywords: 'keywords' });
          }
          if (JSON.parse(localStorage.getItem('currentShop') || '{}').translations.en && (this.formTerms.form.own_terms != JSON.parse(localStorage.getItem('currentShop') || '{}').terms.translations.en.own_terms) && this.formTerms.form.own_terms != '') {
            this.arrTranslate.push({ language: 'fr', text: this.formTerms.form.own_terms, own_terms: 'own_terms' });
          }
          if (this.arrTranslate.length != 0) {
            combineLatest(
              this.translateDataService.translate(this.arrTranslate)
            ).subscribe(
              (docs: any) => {
                docs.forEach((doc: any, i: number) => {
                  this.arrTranslate?.forEach((item: any, j: number) => {
                    if (i === j) {
                      item.doc = doc.translation;
                    }
                  });
                });
                this.editShop();
              }, (err: any) => {
                this.spinner.hide();
              }
            )
          }
          else {
            this.editShop();
          }
        } else {
          if (JSON.parse(localStorage.getItem('currentShop') || '{}').translations.fr && (this.formStore.form.description != JSON.parse(localStorage.getItem('currentShop') || '{}').translations.fr.description) && this.formStore.form.description != '') {
            this.arrTranslate.push({ language: 'en', text: this.formStore.form.description, description: 'description' });
          }
          if (JSON.parse(localStorage.getItem('currentShop') || '{}').translations.fr && (this.shopCurrent.translations.fr.keywords != JSON.parse(localStorage.getItem('currentShop') || '{}').translations.fr.keywords) && this.shopCurrent.translations.fr.keywords != '') {
            this.arrTranslate.push({ language: 'en', text: this.shopCurrent.translations.fr.keywords, keywords: 'keywords' });
          }
          if (JSON.parse(localStorage.getItem('currentShop') || '{}').translations.fr && (this.formTerms.form.own_terms != JSON.parse(localStorage.getItem('currentShop') || '{}').terms.translations.fr.own_terms) && this.formTerms.form.own_terms != '') {
            this.arrTranslate.push({ language: 'en', text: this.formTerms.form.own_terms, own_terms: 'own_terms' });
          }

          if (this.arrTranslate.length != 0) {
            combineLatest(this.translateDataService.translate(this.arrTranslate))
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe({
                next: (docs: any) => {
                  docs.forEach((doc: any, i: number) => {
                    this.arrTranslate?.forEach((item: any, j: number) => {
                      if (i === j) {
                        item.doc = doc.translation;
                      }
                    });
                  });
                  this.editShop();
                },
                error: (err: any) => {
                  this.spinner.hide();
                }
              });
          }
          else {
            this.editShop();
          }
        }
      } else if (this.formStore.translate && !this.formTerms.translate) {
        if (this.languageProfile === 'en') {
          if (this.formStore.form.description) {
            this.arrTranslate.push({ language: 'fr', text: this.formStore.form.description, description: 'description' });
          }
          if (this.formStore.form.keywords) {
            this.arrTranslate.push({ language: 'fr', text: this.formStore.form.keywords, keywords: 'keywords' });
          }

          combineLatest(this.translateDataService.translate(this.arrTranslate))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (docs: any) => {
                docs.forEach((doc: any, i: number) => {
                  this.arrTranslate?.forEach((item: any, j: number) => {
                    if (i === j) {
                      item.doc = doc.translation;
                    }
                  });
                });
                this.editShop();
              },
              error: (err: any) => {
                this.spinner.hide();
              }
            });
        } else {
          if (this.formStore.form.description) {
            this.arrTranslate.push({ language: 'en', text: this.formStore.form.description, description: 'description' });
          }
          if (this.formStore.form.keywords) {
            this.arrTranslate.push({ language: 'en', text: this.formStore.form.keywords, keywords: 'keywords' });
          }

          combineLatest(this.translateDataService.translate(this.arrTranslate))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              {
                next: (docs: any) => {
                  docs.forEach((doc: any, i: number) => {
                    this.arrTranslate?.forEach((item: any, j: number) => {
                      if (i === j) {
                        item.doc = doc.translation;
                      }
                    });
                  });
                  this.editShop();
                },
                error: (err: any) => {
                  this.spinner.hide();
                }
              });
        }
      } else if (!this.formStore.translate && this.formTerms.translate) {
        if (this.languageProfile === 'en') {
          if (this.formTerms.form.own_terms) {
            this.arrTranslate.push({ language: 'fr', text: this.formTerms.form.own_terms, own_terms: 'own_terms' });
          }

          combineLatest(this.translateDataService.translate(this.arrTranslate))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              {
                next: (docs: any) => {
                  docs.forEach((doc: any, i: number) => {
                    this.arrTranslate?.forEach((item: any, j: number) => {
                      if (i === j) {
                        item.doc = doc.translation;
                      }
                    });
                  });
                  this.editShop();
                },
                error: (err: any) => {
                  this.spinner.hide();
                }
              }
            );
        } else {
          if (this.formTerms.form.own_terms) {
            this.arrTranslate.push({ language: 'en', text: this.formTerms.form.own_terms, own_terms: 'own_terms' });
          }

          combineLatest(this.translateDataService.translate(this.arrTranslate))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
              {
                next: (docs: any) => {
                  docs.forEach((doc: any, i: number) => {
                    this.arrTranslate?.forEach((item: any, j: number) => {
                      if (i === j) {
                        item.doc = doc.translation;
                      }
                    });
                  });
                  this.editShop();
                },
                error: (err: any) => {
                  this.spinner.hide();
                }
              }
            );
        }
      } else {
        this.editShop();
      }
    }
  }

  getTranslate(): any {
    this.shop.translations = {
      en: {} as Description,
      fr: {} as Description
    } as Translation;
    this.shop.terms.translations = {
      en: {} as OwnTerms,
      fr: {} as OwnTerms
    } as TranslationTerms;

    if (this.arrTranslate && this.arrTranslate.length > 0) {
      this.arrTranslate.forEach((item: any) => {
        if (item.language === 'en') {
          if (item.description) {
            this.shop.translations.en.description = item.doc;
            this.shop.translations.fr.description = this.formStore.form.description;
          } else if (item.keywords) {
            this.shop.translations.en.keywords = item.doc;
            this.shop.translations.fr.keywords = item.text
          } else if (item.own_terms) {
            this.shop.terms.translations.en.own_terms = item.doc;
            this.shop.terms.translations.fr.own_terms = this.formTerms.form.own_terms;
          }
        } else {
          if (item.description) {
            this.shop.translations.fr.description = item.doc;
            this.shop.translations.en.description = this.formStore.form.description;
          } else if (item.keywords) {
            this.shop.translations.fr.keywords = item.doc;
            this.shop.translations.en.keywords = item.text;
          } else if (item.own_terms) {
            this.shop.terms.translations.fr.own_terms = item.doc;
            this.shop.terms.translations.en.own_terms = this.formTerms.form.own_terms;
          }
        }
      });
    }
  }

  getTranslateFromFields(): any {
    if (!this.formStore.translate) {
      if (this.languageProfile === 'en') {
        this.shop.translations.en.description = this.formStore.form.description;
        this.shop.translations.fr.description = this.formStore.description;
        this.shop.translations.en.keywords = this.formStore.form.keywords;
        this.shop.translations.fr.keywords = this.formStore.keywords;
        if (this.editMode) {
          this.shop.translations.en.description = this.shopCurrent.translations.en.description;
          this.shop.translations.fr.description = this.shopCurrent.translations.en.description;
          this.shop.translations.en.keywords = this.shopCurrent.translations.en.keywords;
          this.shop.translations.fr.keywords = this.shopCurrent.translations.en.keywords;
        }

      } else {
        this.shop.translations.fr.description = this.formStore.form.description;
        this.shop.translations.en.description = this.formStore.description;
        this.shop.translations.fr.keywords = this.formStore.form.keywords;
        this.shop.translations.en.keywords = this.formStore.keywords;
      }

    }

    if (!this.formTerms.translate) {
      if (this.languageProfile === 'en') {
        this.shop.terms.translations.en.own_terms = this.formTerms?.form?.own_terms;
        this.shop.terms.translations.fr.own_terms = this.formTerms?.own_terms;
      } else {
        this.shop.terms.translations.fr.own_terms = this.formTerms?.form?.own_terms;
        this.shop.terms.translations.en.own_terms = this.formTerms?.own_terms;
      }
    }
  }

  createShop(): any {
    this.errors = [];
    this.spinner.show();

    if (!this.defaultCurrency) {
      this.CurrencyShared.emit(this.newDefaultCurrency);
    }

    this.shopService.createShop(this.prepareProfilewithPicture(this.prepareShop()))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: (data) => {
            if (data) {
              this.deleteShop(data);
            }
          },
          error: (err) => {
            this.spinner.hide();
            if (err.status === 400) {
              this.errors = [];
              let errorContainer = "name_shop"
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }]
                if (key == "name") {
                  errorContainer = "name_shop"
                } else {
                  errorContainer = "shop_address"
                }
              }
              this.scrollToEl(this.errors[0]);
            } else if (err.status === 500) {
              this.toaster.error(this.translate.instant('boutique.error_500'));
            } else {
              this.toaster.error(err.message);
            }
          }
        }
      );
  }

  deleteShop(shop: any): any {
    this.shopService.deleteShopById(shop.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: (data) => {
            this.SecondStepFormShared.emit(this.prepareProfilewithPicture(this.prepareShop(), true));
            this.accessSecondStep.emit(2);
            this.spinner.hide();
          },
          error: (err) => {
            if (err.status === 400) {
              this.deleteShop(shop);
            } else if (err.status === 500) {
              this.toaster.error(this.translate.instant('boutique.error_500'));
            }
          }
        }
      );
  }

  editShopClick(): any {
    this.editMode = true;
    this.saveAndContinue();
  }

  editShop(): any {
    this.errors = [];
    this.shopService.patchShopById(this.prepareProfilewithPicture(this.prepareShop()), this.idShopCurrent)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: data => {
          if (data) {
            this.toaster.success(this.translate.instant('boutique.edit_shop'));
            this.editMode = false;
            this.spinner.hide();
          }
        },
        error: (err) => {
          if (err.status === 400) {
            this.errors = [];
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
              this.scrollToEl(this.errors[0]);
            }
          } else if (err.status === 500) {
            this.toaster.error(this.translate.instant('boutique.error_500'));
          }
        }
      });
  }

  prepareShop(): any {
    if (this.logoShop && this.logoShop !== undefined) {
      this.shop.logo = this.logoShop;
    }

    this.shop = {
      ...this.shop,
      banner: this.bannerShop,
      ambassador: this.createShopObj.ambassador,
      name: this.formStore.form.name,
      www: this.formStore.form.www,
      instagram: this.formStore.form.instagram,
      facebook: this.formStore.form.facebook,
      maintenanceMode: this.formStore.form.maintenance_mode,
      shop_address: {
        name: this.createShopObj.shop_address ? this.createShopObj.shop_address.name : this.shopCurrent?.shop_address?.name,
        name_ext: this.createShopObj?.shop_address ? this.createShopObj?.shop_address?.name_ext : this.shopCurrent?.shop_address?.name_ext,
        company_name: this.createShopObj?.shop_address ? this.createShopObj?.shop_address?.company_name : this.shopCurrent?.shop_address?.company_name,
        street: this.createShopObj?.shop_address ? this.createShopObj?.shop_address?.street : this.shopCurrent?.shop_address?.street,
        street2: this.createShopObj?.shop_address ? this.createShopObj?.shop_address?.street2 : this.shopCurrent?.shop_address?.street2,
        city: this.createShopObj?.shop_address ? this.createShopObj?.shop_address?.city : this.shopCurrent?.shop_address?.city,
        postal_code: this.createShopObj?.shop_address ? this.createShopObj?.shop_address?.postal_code : this.shopCurrent?.shop_address?.postal_code,
        region: this.createShopObj?.shop_address ? this.createShopObj?.shop_address?.region : this.shopCurrent?.shop_address?.region,
        country: this.createShopObj?.shop_address ? this.createShopObj?.shop_address?.country : this.shopCurrent?.shop_address?.country,
        phone: this.createShopObj?.shop_address ? (this.createShopObj.shop_address?.phone?.internationalNumber?.length > 0 ?
          this.createShopObj?.shop_address?.phone?.internationalNumber : this.createShopObj?.shop_address?.phone?.number
            ? this.createShopObj?.shop_address?.phone?.number : this.createShopObj?.shop_address?.phone) : this.shopCurrent?.shop_address?.phone,
      },
      terms: {
        ...this.shop.terms,
        exchangeable: this.createShopObj?.terms?.exchangeable,
        exchangeable_days: Number(this.createShopObj?.terms?.exchangeable_days),
        exchangeable_personalized: this.createShopObj?.terms?.exchangeable_personalized,
        free_return: this.createShopObj?.terms?.free_return,
        refundable: this.createShopObj?.terms?.refundable,
        refundable_days: Number(this.createShopObj?.terms?.refundable_days),
        refundable_personalized: this.createShopObj?.terms?.refundable_personalized,
        shop: this.createShopObj?.terms?.shop,
      }
    }

    this.getTranslate();
    this.getTranslateFromFields();
    return this.shop;
  }

  prepareProfilewithPicture(shop: any, withMail = false): any {
    this.formData = new FormData();
    if (!_.isEmpty(this.createShopObj.ambassador)) {
      this.formData.append('ambassador', shop.ambassador);
    } else {
      delete shop.ambassador;
    }

    this.formData.append('name', shop.name);
    if (shop.logo) {
      this.formData.append('logo', shop.logo);
    } else {
      delete shop.logo;
    }

    if (shop.banner) {
      this.formData.append('banner', shop.banner);
    }
    else if (shop.banner == '') {
      this.formData.append('banner', '');
    }
    else {
      delete shop.banner;
    }

    this.formData.append('www', shop.www);
    this.formData.append('facebook', shop.facebook);
    this.formData.append('send_email', JSON.stringify(withMail));
    this.formData.append('instagram', shop.instagram);
    this.formData.append('maintenance_mode', shop.maintenanceMode ? shop.maintenanceMode : false);
    this.formData.append('translations', JSON.stringify(shop.translations));
    this.formData.append('shop_address.name', shop.shop_address.name);
    this.formData.append('shop_address.street', shop.shop_address.street);
    this.formData.append('shop_address.street2', shop.shop_address.street2);
    this.formData.append('shop_address.postal_code', shop.shop_address.postal_code);
    this.formData.append('shop_address.city', shop.shop_address.city);
    this.formData.append('shop_address.phone', shop.shop_address.phone);
    this.formData.append('shop_address.region', shop.shop_address.region);
    this.formData.append('shop_address.country', shop.shop_address.country);
    this.formData.append('terms.exchangeable', shop.terms.exchangeable);
    this.formData.append('terms.exchangeable_days', shop.terms.exchangeable_days);
    this.formData.append('terms.exchangeable_personalized', shop.terms.exchangeable_personalized);
    this.formData.append('terms.free_return', shop.terms.free_return);
    this.formData.append('terms.refundable', shop.terms.refundable);
    this.formData.append('terms.refundable_days', shop.terms.refundable_days);
    this.formData.append('terms.refundable_personalized', shop.terms.refundable_personalized);
    this.formData.append('terms.translations', JSON.stringify(shop.terms.translations));
    return this.formData;
  }

  updateBannerImg(value: any) {
    console.log('updateBannerImg', value)
    if (this.idShopCurrent) {
      this.bannerShop = value;
      let shop = this.prepareShop();
      if (this.bannerShop == undefined) {
        shop.banner = '';
      }

      this.shopService.patchShopById(this.prepareProfilewithPicture(shop), this.idShopCurrent)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: data => {
            if (data) {
              this.toaster.success(this.translate.instant('boutique.edit_shop'));
            }
          },
          error: (err) => {
            if (err.status === 400) {
              this.errors = [];
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }];
                this.scrollToEl(this.errors[0]);
              }
            } else if (err.status === 500) {
              this.toaster.error(this.translate.instant('boutique.error_500'));
            }
          }
        });
    }
  }

  scrollToEl(error: any) {
    if ((<HTMLInputElement>document.getElementById(error.key)) != null) {
      (<HTMLInputElement>document.getElementById(error.key)).scrollIntoView({
        behavior: 'smooth', block: "end", inline: "end"
      });
      this.spinner.hide();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}