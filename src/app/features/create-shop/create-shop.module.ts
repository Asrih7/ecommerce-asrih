import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FirstletterupperPipe } from 'src/app/shared/pipes/firstlettreupercase.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateShopRoutingModule } from './create-shop-routing.module';
import { CreateShopComponent } from './create-shop.component';
import { FirstStepComponent } from './partials/first-step/first-step.component';
import { ThirdStepComponent } from './partials/third-step/third-step.component';

@NgModule({
  declarations: [
    CreateShopComponent,
    FirstStepComponent,
    ThirdStepComponent,
    FirstletterupperPipe
  ],
  imports: [
    CommonModule,
    CreateShopRoutingModule,
    SharedModule,
    NgxIntlTelInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
    
  ],
  exports: [
    MatSlideToggleModule 
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    NgxImageCompressService
  ]
})
export class CreateShopModule { }
