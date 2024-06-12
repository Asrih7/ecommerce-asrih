import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChecktRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { UpdateAdressPopinComponent } from './update-adress-popin/update-adress-popin.component';

@NgModule({
  declarations: [
    CheckoutComponent,
    UpdateAdressPopinComponent
  ]
  ,
  imports: [
    CommonModule,
    TranslateModule,
    ChecktRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    SharedModule
  ]
})
export class CheckoutModule { }
