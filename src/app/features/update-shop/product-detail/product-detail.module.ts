import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailComponent } from './product-detail.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    ProductDetailComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ProductDetailRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class ProductDetailModule { }
