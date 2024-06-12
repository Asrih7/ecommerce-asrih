import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormGeneric } from 'src/@core/models/form-generic';
import { SHOP_INFO_ACCOUNT } from 'src/@core/models/form.model';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Shop } from 'src/@core/models/shop';
import { NgxImageCompressService } from 'ngx-image-compress';
// import { ShareableObjectsService } from 'src/@core/services/shareable-objects.service';

@Component({
  selector: 'app-store-second-step',
  templateUrl: './store-second-step.component.html',
  styleUrls: ['./store-second-step.component.scss']
})
export class StoreSecondStepComponent implements OnInit, OnChanges {
  @Input() newListFieldsSorting: any;
  @Input() submitFormCheck: any;
  @Input() listShops: any;
  @Input() errors: any;
  @Input() shopCurrent: any;
  @Input() languageProfile: any;

  @Output() formStoreShared: EventEmitter<any> = new EventEmitter();
  @Output() bannerImgChange = new EventEmitter<any>();

  @ViewChild('keywords') keywords: any;
  @ViewChild('keywordsTranslate') keywordsTranslate: ElementRef | undefined;
  @ViewChild('descriptionTranslate', { static: false }) descriptionTranslate: any;

  errs: any = [];
  fileLogo: any;
  fileBanner: any;
  logoImg: any;
  bannerImg: any;
  formData: any;
  itemsKeyWords: any = [];
  itemsKeyWordsTranslate: any = [];
  errorObg = {};
  checkTranslate = true;
  form: FormGeneric = new FormGeneric(this.fb);
  foo: any;
  editShop: Shop | undefined;
  imgResultBeforeCompression: string = '';
  imgResultAfterCompression: string = '';
  ismaintenance_mode: boolean=false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private imageCompress: NgxImageCompressService

  ) {
    this.form.group = this.fb.group(SHOP_INFO_ACCOUNT);
    this.form.group.valueChanges.subscribe((value) => {
      this.formStoreShared.emit(value);
    })
  }

  ngOnInit(): void {
    if (this.router.url.includes('create-shop')) {
      this.form.group.reset();
      this.formInit();
    }else{
      this.setValueForm();
    }
  }

  ngDoCheck() {
    if (!this.router.url.includes('create-shop')) {
      this.prepareStoreData();
    }
  }

  inChanges(): any {
    if (this.shopCurrent) {
      this.form.populateForm(this.shopCurrent);
      this.shopCurrent.banner ? this.bannerImg = this.shopCurrent.banner : this.bannerImg = '';
      this.itemsKeyWords = [];
      if (this.languageProfile) {
        if (this.languageProfile === 'en') {
          this.itemsKeyWords = [];
          this.itemsKeyWordsTranslate = [];
          if (!_.isEmpty(this.shopCurrent.translations) && this.shopCurrent.translations.en.description) {
            this.form.group.get('description')?.setValue(this.shopCurrent.translations.en.description);
            this.foo = this.shopCurrent.translations.fr.description;
          } else {
            this.form.group.get('description')?.setValue('');
            this.foo = {};
          }
          if (!_.isEmpty(this.shopCurrent.translations) && this.shopCurrent.translations.en.keywords) {
            const arr1 = this.shopCurrent.translations.en.keywords.split(',');
            arr1.forEach((element: any) => {
              this.itemsKeyWords.push(element);
            });
            const arr2 = this.shopCurrent.translations.fr.keywords.split(',');
            arr2.forEach((element: any) => {
              this.itemsKeyWordsTranslate.push(element);
            });
          }
        } else {
          this.itemsKeyWords = [];
          this.itemsKeyWordsTranslate = [];
          if (!_.isEmpty(this.shopCurrent.translations) && this.shopCurrent?.translations?.fr?.description) {
            this.form.group.get('description')?.setValue(this.shopCurrent?.translations?.fr?.description);
            this.foo = this.shopCurrent.translations.en.description;
          } else {
            this.form.group.get('description')?.setValue('');
            this.foo = {};
          }
          if (!_.isEmpty(this.shopCurrent.translations) && this.shopCurrent?.translations?.fr?.keywords) {
            const arr1 = this.shopCurrent.translations.fr.keywords.split(',');
            arr1.forEach((element: any) => {
              this.itemsKeyWords.push(element);
            });
            const arr2 = this.shopCurrent.translations.en.keywords.split(',');
            arr2.forEach((element: any) => {
              this.itemsKeyWordsTranslate.push(element);
            });
          }
        }
      }
    }
  }
  ngOnChanges(changes: any): void {
    if (!this.router.url.includes('create-shop')) {
      this.setValueForm();
    }
    if (!this.form.group.value.description?.trim().length) {
      this.form.group.get('description')?.setValue('');
    }
    if (this.checkTranslate) {
      this.formStoreShared.emit({ form: this.form.group.value, logo: this.fileLogo, banner: this.fileBanner, translate: this.checkTranslate });
    }
    if (this.shopCurrent && changes.shopCurrent) {
      if (changes.shopCurrent.currentValue !== changes.shopCurrent.previousValue) {
        this.inChanges();
      }
    }
    if (!_.isEmpty(this.errors)) {
      this.errors.forEach((element: any) => {
        if (element.key === 'name') {
          this.errs.push(element);
        }
      });
    } else {
      this.errs = [];
    }
    if (this.submitFormCheck) {
      if (!_.isEmpty(this.fileLogo)) {
        console.log('file logo', this.fileLogo);
        this.form.group.get('logo')?.setValue(this.fileLogo);
      }
      if (!_.isEmpty(this.fileBanner)) {
        this.form.group.get('banner')?.setValue(this.fileBanner);
      }
      if (this.itemsKeyWords.length > 0) {
        this.form.group.get('keywords')?.setValue(this.itemsKeyWords.toString());
      }
    }
  }
  formInit(): any {
    this.form.group = new FormGroup({
      name: new FormControl('', Validators.required),
      // maintenance_message: new FormControl('', Validators.required),
      maintenance_mode: new FormControl(this.ismaintenance_mode),
      description: new FormControl(''),
      banner: new FormControl(''),
      logo: new FormControl(''),
      www: new FormControl(''),
      instagram: new FormControl(''),
      facebook: new FormControl(''),
      keywords: new FormControl(''),
      send_email: new FormControl(false)
    });
  }
  changeToggle(event: any) {
    this.form.group.get('maintenance_mode')?.setValue(event.checked);
  }
  newLogo(): any {
    this.imageCompress.uploadFile().then(({ image, fileName, orientation }) => {
      this.imageCompress
        .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
        .then(compressedImage => {
          this.logoImg = compressedImage;
          this.fileLogo = this.dataURLtoFile(compressedImage, fileName);
        });
    });
  }


  dataURLtoFile(dataurl: any, filename: any) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      bsLength = bstr.length, //base64 string length
      u8arr = new Uint8Array(bsLength);

    while (bsLength--) {
      u8arr[bsLength] = bstr.charCodeAt(bsLength);
    }

    return new File([u8arr], filename, { type: mime });
  }
  newBanner(): any {
    this.imageCompress.uploadFile().then(({ image, fileName, orientation }) => {
      console.log('Size in bytes of the uploaded image was:', this.imageCompress.byteCount(image));
      console.log('fileName', fileName);
      this.imageCompress
        .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
        .then(compressedImage => {
          this.bannerImg = compressedImage;
          this.fileBanner = this.dataURLtoFile(compressedImage, fileName);
          this.bannerImgChange.emit(this.fileBanner);
          console.log('fileBanner', this.fileBanner);
          console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
        });
    });
  }
  deletePicture(typePicture: any): any {
    if (typePicture === 'logo') {
      delete this.logoImg;
    } else {
      delete this.bannerImg;
      this.shopCurrent.banner = '';
      this.bannerImgChange.emit(undefined);
    }
  }
  prepareKeyWords(e: any): any {
    const keyword = e.target.value;
    if (keyword.trim().length) {
      this.itemsKeyWords.push(keyword);
      if (this.router.url.includes('create-shop')) {
        this.form.group.get('keywords')?.setValue(this.itemsKeyWords.toString());
      }
      else {
        if (this.languageProfile == 'en') {
          this.shopCurrent.translations.en.keywords = this.itemsKeyWords.toString();
        }
        else {
          this.shopCurrent.translations.fr.keywords = this.itemsKeyWords.toString();
        }
      }

    }
    this.keywords.nativeElement.value = '';
  }

  deleteKeyword(i: any): any {
    this.itemsKeyWords = this.itemsKeyWords.filter((word: any, index: number) => index !== i);
    this.form.group.get('keywords')?.setValue(this.itemsKeyWords.toString());
  }

  setValueForm(): any {
    console.log('this.shop', this.shopCurrent)
    if (this.shopCurrent) {
      localStorage.setItem('currentShop',JSON.stringify(this.shopCurrent))
      this.setItemsKeywords();
      this.form.group = new FormGroup({
        name: new FormControl(this.shopCurrent.name, Validators.required),
        description: new FormControl(this.languageProfile && this.languageProfile === 'en' && this.shopCurrent.translations.en ? this.shopCurrent.translations.en.description : (this.languageProfile && this.languageProfile === 'fr' && this.shopCurrent.translations.fr ? this.shopCurrent.translations?.fr?.description : '')),
        maintenance_mode: new FormControl(this.shopCurrent.maintenance_mode),
        banner: new FormControl(this.shopCurrent.banner),
        logo: new FormControl(this.shopCurrent.logo),
        www: new FormControl(this.shopCurrent.www),
        instagram: new FormControl(this.shopCurrent.instagram),
        facebook: new FormControl(this.shopCurrent.facebook),
        send_email: new FormControl(this.shopCurrent.send_email)
      });
    }

  }
  setItemsKeywords() {
    this.itemsKeyWords = [];
    if (this.languageProfile === 'en') {
      if (this.shopCurrent.translations.en) {

        this.shopCurrent.translations.en.keywords.split(',').forEach((element: any) => {
          if (element.trim().length) {
            this.itemsKeyWords.push(element);
          }
        });
      }

    }
    else {
      if (this.shopCurrent.translations.fr) {
        this.shopCurrent.translations.fr.keywords.split(',').forEach((element: any) => {
          if (element.trim().length) {
            this.itemsKeyWords.push(element);
          }
        });
      }
    }

  }
  prepareStoreData() {
    if (this.shopCurrent) {
      if (this.languageProfile == 'en') {
        if (this.shopCurrent.translations.en) {
          this.shopCurrent.translations.en.description = this.form.group.get('description')?.value;
          this.shopCurrent.translations.en.keywords =
            this.itemsKeyWords.toString() != '' ?
              this.itemsKeyWords.toString() :
              this.shopCurrent.translations.en.keywords;
        }

      }
      else {
        if (this.shopCurrent.translations.fr) {
          this.shopCurrent.translations.fr.description = this.form.group.get('description')?.value;
          this.shopCurrent.translations.fr.keywords =
            this.itemsKeyWords.toString() != '' ?
              this.itemsKeyWords.toString() :
              this.shopCurrent.translations.fr.keywords;
        }
      }

      this.shopCurrent.www = this.form.group.get('www')?.value;
      this.shopCurrent.instagram = this.form.group.get('instagram')?.value;
      this.shopCurrent.facebook = this.form.group.get('facebook')?.value;
      this.shopCurrent.send_email = this.form.group.get('send_email')?.value;
      this.shopCurrent.maintenance_mode = this.form.group.get('maintenance_mode')?.value;
    }
  }
}


