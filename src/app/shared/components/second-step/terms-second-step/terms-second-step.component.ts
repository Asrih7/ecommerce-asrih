import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild, ElementRef, Renderer2, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormGeneric } from 'src/@core/models/form-generic';
import { SHOP_INFOS } from 'src/@core/models/form.model';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-second-step',
  templateUrl: './terms-second-step.component.html',
  styleUrls: ['./terms-second-step.component.scss']
})
export class TermsSecondStepComponent implements OnInit, OnChanges {
  @Input() termsfileds: any;
  @Input() submitFormCheck: any;
  @Input() errors: any;
  @Input() shopCurrent: any;
  @Input() languageProfile: any;
  checkTranslateTerms = true;
  errs: any = [];
  ownsTT: any;
  map: any = []
  form: FormGeneric = new FormGeneric(this.fb);
  @Output() formTermsShared: EventEmitter<any> = new EventEmitter();
  @ViewChild('ownsTermsTranslate') ownsTermsTranslate: ElementRef | undefined;
  constructor(private fb: FormBuilder, private router: Router) {
    this.form.group = this.fb.group(SHOP_INFOS);
  }

  ngOnInit(): void {
    if (this.router.url.includes('create-shop')) {
      this.form.group.reset();
      this.form?.group?.get('terms')?.valueChanges.subscribe(
        {
          next: (value) => {
            
            this.formTermsShared.emit(this.form?.group.value)
          }
        })
      // this.formInit();
    }else{
      this.form?.group?.get('terms')?.valueChanges.subscribe(
        {
          next: (value) => {
            this.formTermsShared.emit({ formTerms: value, translate: this.checkTranslateTerms });
          }
        })
      
    }
  }
  ngDoCheck() {
    this.prepareTermsData();
  }
  inChanges(): any {
    if (this.shopCurrent) {
      this.form.group.get('terms')?.get('exchangeable')?.setValue(this.shopCurrent.terms.exchangeable);
      this.form.group.get('terms')?.get('exchangeable_days')?.setValue(this.shopCurrent.terms.exchangeable_days);
      this.form.group.get('terms')?.get('exchangeable_personalized')?.setValue(this.shopCurrent.terms.exchangeable_personalized);
      this.form.group.get('terms')?.get('free_return')?.setValue(this.shopCurrent.terms.free_return);
      this.form.group.get('terms')?.get('refundable')?.setValue(this.shopCurrent.terms.refundable);
      this.form.group.get('terms')?.get('refundable_days')?.setValue(this.shopCurrent.terms.refundable_days);
      this.form.group.get('terms')?.get('refundable_personalized')?.setValue(this.shopCurrent.terms.refundable_personalized);
      if (this.languageProfile === 'en') {
        if (this.shopCurrent.terms.translations.en.own_terms) {
          this.form.group.get('terms')?.get('own_terms')?.setValue(this.shopCurrent.terms.translations.en.own_terms);
          this.ownsTT = this.shopCurrent.terms.translations.fr.own_terms;
        } else {
          this.form.group.get('terms')?.get('own_terms')?.setValue('');
          this.ownsTT = {};
        }
      } else {
        if (this.shopCurrent.terms.translations?.fr?.own_terms) {
          this.form.group.get('terms')?.get('own_terms')?.setValue(this.shopCurrent.terms.translations.fr.own_terms);
          this.ownsTT = this.shopCurrent.terms.translations.en.own_terms;
        } else {
          this.form.group.get('terms')?.get('own_terms')?.setValue('');
          this.ownsTT = {};
        }
      }
    }
    if (!_.isEmpty(this.errors)) {
      this.errors.forEach((element: any) => {
        if (element.key === 'terms') {
          this.errs.push(element);
        }
      });
    } else {
      this.errs = [];
    }
  }
  ngOnChanges(changes: any): void {   
    if (this.submitFormCheck) {    
      if (this.checkTranslateTerms) {
        if(!this.form.group.get('terms')?.value.own_terms?.trim().length){
          this.form.group.get('terms')?.get('own_terms')?.setValue('');
        }
        this.formTermsShared.emit({ formTerms: this.form.group.get('terms')?.value, translate: this.checkTranslateTerms });
      } 
    }
    if (this.shopCurrent && changes.shopCurrent) {
      if (changes.shopCurrent.currentValue !== changes.shopCurrent.previousValue) {
        this.inChanges();
      }
    }
    if (!this.router.url.includes('create-shop')) {
      this.inChanges();
    }
  }
  prepareTermsData(){
    if(this.shopCurrent){   
      this.shopCurrent.terms.exchangeable=this.form.group.get('terms')?.get('exchangeable')?.value;
      this.shopCurrent.terms.exchangeable_days=this.form.group.get('terms')?.get('exchangeable_days')?.value;
      this.shopCurrent.terms.exchangeable_personalized=this.form.group.get('terms')?.get('exchangeable_personalized')?.value;
      this.shopCurrent.terms.free_return=this.form.group.get('terms')?.get('free_return')?.value;
      this.shopCurrent.terms.refundable=this.form.group.get('terms')?.get('refundable')?.value;
      this.shopCurrent.terms.refundable_days=this.form.group.get('terms')?.get('refundable_days')?.value;
      this.shopCurrent.terms.refundable_personalized=this.form.group.get('terms')?.get('refundable_personalized')?.value;   
        if(this.languageProfile=='en'){
          if(this.form.group.get('terms')?.get('own_terms')?.value!=this.shopCurrent.terms.translations.en.own_terms){
            this.shopCurrent.terms.translations.en.own_terms=this.form.group.get('terms')?.get('own_terms')?.value;
          }
        }
        else{
          if(this.form.group.get('terms')?.get('own_terms')?.value!=this.shopCurrent.terms?.translations?.fr?.own_terms){
            if(this.shopCurrent.terms.translations.fr){
              this.shopCurrent.terms.translations.fr.own_terms=this.form.group.get('terms')?.get('own_terms')?.value;
            }
            
          }
        }    
    }
  }
  
}
