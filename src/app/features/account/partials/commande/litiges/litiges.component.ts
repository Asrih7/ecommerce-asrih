import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject, combineLatest, lastValueFrom, takeUntil } from 'rxjs';
import { Dispute, Translation } from 'src/@core/models/dispute';
import { FormGeneric } from 'src/@core/models/form-generic';
import { DISPUTE__FORM } from 'src/@core/models/form.model';
import { DisputeService } from 'src/@core/services/disput.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { TranslateDataService } from 'src/@core/services/translateData.service';

@Component({
  selector: 'app-litiges',
  templateUrl: './litiges.component.html',
  styleUrls: ['./litiges.component.scss']
})
export class LitigesComponent implements OnInit, OnDestroy {
  listFields: { key: string; value: any }[] = [];
  listFieldCreation: { key: string; value: any }[] = [];
  disputeList: Dispute[] = [];
  language: string = '';
  form: FormGeneric = new FormGeneric(this.fb);
  modalLitiges: boolean = false;
  query_types: any[] = [];
  dispute: Dispute = {} as Dispute;
  formData: FormData = new FormData();
  errors: any[] = [];
  p2: any;
  formatDate: string;
  slideImg: any;
  private _unsubscribeAll: Subject<any> = new Subject();
  loadingDisputeList = true;
  languageProfile: string;
  public arrTranslate: any = [];
  public orderOptions: any[] = [];
  public selectedOrderId: number;

  constructor(
    private disputeService: DisputeService,
    private fb: FormBuilder,
    private settingsService: RegionalSettingsService,
    private toasterService: ToastrService,
    private translate: TranslateService,
    private translateDataService: TranslateDataService
  ) {
    this.form.group = this.fb.group(DISPUTE__FORM);
  }

  ngOnInit(): void {
    this.modalLitiges = false;
    this.language = localStorage.getItem('language') || '';


    this.dispute.file = null;

    this.getDisputeFields();
    this.getAllDispute();

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (settings: any) => {
          if (settings?.language) {
            this.getDisputeFields();
          }
        }
      });
  }


  getTranslatedDescription(translations: any): string {
    this.language = localStorage.getItem('language') || 'en';
    return translations && translations[this.language] ? translations[this.language].description : '';
  }
  getOrderReferenceNumber(orderId: number): string {
    const order = this.orderOptions.find(order => order.value === orderId);
    return order ? order.display_name.replace('#', '') : '';
  }
  
  
  clearCache(event: any) {
    event.target.value = null;
  }

  showImage(img: any): any {
    this.slideImg = img;
    document.querySelector('body')?.classList.add('overflow');
  }

  closeSlide(): any {
    delete this.slideImg;
    this.hideModal();
  }

  getDisputeFields(): void {
    this.listFieldCreation = [];
    this.listFields = [];
    this.readControlFieldDispute();
    this.formatDate = this.language === 'fr' ? 'dd-MM-yyyy' : 'yyyy-MM-dd';
  }

  readControlFieldDispute(): void {
    this.listFields = [];
    this.listFieldCreation = [];

    this.disputeService
      .getInformationDispute()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((fields: any) => {
        const getActions = fields.actions.GET;
        for (const [key, value] of Object.entries(getActions)) {
          this.listFields = [...this.listFields, { key, value }];
        }

        const postActions = fields.actions.POST;
        for (const [key, value] of Object.entries(postActions)) {
          this.listFieldCreation = [...this.listFieldCreation, { key, value }];
          if (key === 'query_type') {
            (value as any).choices.forEach((type: any) => {
              this.query_types.push(type);
            });
          }

          if (key === 'order') {
            (value as any).choices.forEach((order: any) => {
              this.orderOptions.push(order);
              console.log('Order added:', order); // Debug log
              this.orderOptions[order] = order; // Map orders by their ID
            });
          }
        }

        this.listFieldCreation = this.listFieldCreation.filter((field) =>
          ['query_type', 'file', 'order', 'description'].includes(field.key)
        );

        this.listFields = this.listFields.filter((field) =>
          ['id', 'created_on', 'modified_on', 'query_type', 'file', 'order', 'description'].includes(field.key)
        );
      });
  }

  getAllDispute(): void {
    this.loadingDisputeList = true;
    this.disputeService
      .getDispute()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.disputeList = _.orderBy(data, 'created_on', 'desc');
        this.loadingDisputeList = false;
      });
  }

  getQueryTypeName(value: string): string {
    const type = this.query_types.find(t => t.value === value);
    return type ? type.display_name : value;
  }

  showModal(): void {
    this.modalLitiges = true;
    document.querySelector('body')?.classList.add('overlflow');
}

hideModal(): void {
    this.modalLitiges = false;
    document.querySelector('body')?.classList.remove('overlflow');
}

  async createDispute(): Promise<void> {
    this.errors = [];
    this.dispute = await this.prepareDispute();
    const formData = this.prepareDisputeFormData(this.dispute);
    this.disputeService.postDispute(formData).subscribe({
      next: (data: any) => {
        this.hideModal();
        this.form.group.reset();
        this.toasterService.success(this.translate.instant('litiges.confirmation_litige'));
        this.getAllDispute();
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

  async prepareDispute(): Promise<Dispute> {
    this.arrTranslate = [];
    let translations: any = { en: {}, fr: {} } as Translation;

    const language = this.language === 'fr' ? 'en' : 'fr';
    if (this.form.group?.get('description')?.value) {
      this.arrTranslate.push({ language, text: this.form.group?.get('description')?.value, description: 'description' });
    }
    else if (!this.form.group?.get('description')?.value) {
      translations = {};
    }
    if (this.arrTranslate.length) {
      const docs = await lastValueFrom(combineLatest(this.translateDataService.translate(this.arrTranslate)));
      docs.forEach((doc: any, i: number) => {
        this.arrTranslate.forEach((item: any, j: number) => {
          if (i === j) item.doc = doc.translation;
        });
      });

      if (this.arrTranslate && this.arrTranslate.length > 0) {
        this.arrTranslate.forEach((item: any) => {
          if (item.description) {
            translations.en.description = item.language === 'en' ? item.doc : this.form.group?.get('description')?.value;
            translations.fr.description = item.language === 'fr' ? item.doc : this.form.group?.get('description')?.value;
          }
        });
      }
    }

    this.dispute.order = this.form.group.get('order')?.value;; 
    this.dispute.query_type = this.form.group.value.query_type; 
    this.dispute.translations = translations;
    return this.dispute;
  }

  prepareDisputeFormData(dispute: Dispute): FormData {
    const formData = new FormData();
    formData.append('order', dispute?.order?.toString());
    formData.append('query_type', dispute.query_type);
    formData.append('translations', JSON.stringify(dispute.translations));
    if (dispute.file !== null) {
      formData.append('file', dispute.file);
    }
    return formData;
  }

  preparPicture(e: any): any {
    this.dispute.file = e.target.files[0];
    this.formData = new FormData();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
