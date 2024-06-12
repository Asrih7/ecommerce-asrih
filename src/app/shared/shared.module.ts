import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { LoaderIndicatorComponent } from './components/loader-indicator/loader-indicator.component';
import { GoogleLoginProvider, FacebookLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { PopinComponent } from './components/popin/popin.component';
import { FirstletterupperPipe } from './pipes/firstlettreupercase.pipe';
import { ShortDatePipe } from './pipes/short-date.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReplacePipe } from './pipes/replace.pipe';
import { FirstLetterPipe } from './pipes/firstletter.pipe';
import { GetFileNamePipe } from './pipes/get-file-name.pipe';
import { ContactAdminComponent } from './components/contact-admin/contact-admin.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { MatSelectModule } from '@angular/material/select';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatOptionModule } from '@angular/material/core';
import { AddressBlockComponent } from './components/address-block/address-block.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AccordianDirective } from "./directives/accordian.directive";
import { AccordianTitleDirective } from "./directives/accordian-title.directive";
import { ScrollToTopDirective } from "./directives/scroll-to-top.directive";
import { PaypalBlockComponent } from './components/paypal-block/paypal-block.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { SecondStepComponent } from './components/second-step/second-step.component';
import { AmbassadorSecondStepComponent } from './components/second-step/ambassador-second-step/ambassador-second-step.component';
import { TermsSecondStepComponent } from './components/second-step/terms-second-step/terms-second-step.component';
import { AddressSecondStepComponent } from './components/second-step/address-second-step/address-second-step.component';
import { StoreSecondStepComponent } from './components/second-step/store-second-step/store-second-step.component';
import { WalletSecondStepComponent } from './components/second-step/wallet-second-step/wallet-second-step.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoaderComponent } from './components/noo-loader/noo-loader.component';
import { TabComponent } from './components/noo-tabs/noo-tab/noo-tab.component';
import { TabsComponent } from './components/noo-tabs/noo-tabs.component';
import { SingleProductCardComponent } from './components/single-product-card/single-product-card.component';
import { ModalSettingsComponent } from '../layout/footer/modal-settings/modal-settings.component';
import { ChoiceLabelPipe } from './pipes/choice-label.pipe';

@NgModule({
  declarations: [
    LoaderIndicatorComponent,
    LoaderComponent,
    TabsComponent,
    TabComponent,
    PopinComponent,
    ShortDatePipe,
    FirstLetterPipe,
    GetFileNamePipe,
    ContactAdminComponent,
    UserInfoComponent,
    AddressBlockComponent,
    AccordianDirective,
    AccordianTitleDirective,
    ScrollToTopDirective,
    PaypalBlockComponent,
    SecondStepComponent,
    AmbassadorSecondStepComponent,
    TermsSecondStepComponent,
    AddressSecondStepComponent,
    StoreSecondStepComponent,
    WalletSecondStepComponent,
    SingleProductCardComponent,
    ModalSettingsComponent,
    ChoiceLabelPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxIntlTelInputModule,
    MatOptionModule,
    MatAutocompleteModule,
    TranslateModule,
    MatInputModule,
    BsDatepickerModule.forRoot(),
    NgxPayPalModule,
    MatSlideToggleModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    }),
  ],
  exports: [
    LoaderIndicatorComponent,
    TabsComponent,
    TabComponent,
    LoaderComponent,
    PopinComponent,
    ChoiceLabelPipe,
    ShortDatePipe,
    FirstLetterPipe,
    BsDatepickerModule,
    GetFileNamePipe,
    ContactAdminComponent,
    UserInfoComponent,
    AddressBlockComponent,
    AccordianDirective,
    AccordianTitleDirective,
    ScrollToTopDirective,
    PaypalBlockComponent,
    SecondStepComponent,
    AmbassadorSecondStepComponent,
    TermsSecondStepComponent,
    AddressSecondStepComponent,
    StoreSecondStepComponent,
    WalletSecondStepComponent,
    SingleProductCardComponent,
    ModalSettingsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedModule {
  static forRoot(): any {
    return {
      ngModule: SharedModule,
      providers: [
        FirstletterupperPipe,
        ShortDatePipe,
        ReplacePipe,
        FirstLetterPipe,
        GetFileNamePipe,
        DatePipe,
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: [
              {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider(
                  '908028250457-odvbtaaitlo23bnpg251qpbf4l5s44km.apps.googleusercontent.com'
                )
              },
              {
                id: FacebookLoginProvider.PROVIDER_ID,
                provider: new FacebookLoginProvider('1248004276062841')
              }
            ]
          } as SocialAuthServiceConfig,
        },
      ]
    };
  }
}
