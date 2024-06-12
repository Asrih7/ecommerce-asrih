import { Component, OnInit } from '@angular/core';
import { scrollTop0 } from 'src/@core/utils/helpers';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})
export class CreateShopComponent implements OnInit {
  infosShop: any;
  currency: any;
  validStep1: boolean = false;
  validStep2: boolean = false;

  languageProfile: any = '';
  public currentStep: number = 1;

  constructor() { }

  ngOnInit(): void {
    scrollTop0();
  }

  SecondStepFormShared(event: any): any {
    this.infosShop = event;
  }

  handlerCurrecyShared(event: any): any {
    this.currency = event;
  }

  handlerAccessThirdStep(step: any): any {
    // this.stepsClicked.push(step);
  }

  handlerAccessFirstStep(step: any): any {
    scrollTop0();
    this.validStep1 = true;
    this.currentStep = 2;
  }

  handlerAccessSecondStep(step: any): any {
    scrollTop0();
    this.validStep2 = true;
    this.currentStep = 3;
  }

  handlerLanguageStore(language: any): any {
    this.languageProfile = language;
  }

  setStep(step: number) {
    scrollTop0();
    this.currentStep = step;
  }
}
