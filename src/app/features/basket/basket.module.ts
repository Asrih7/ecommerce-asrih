import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { BasketComponent } from './basket.component';
import { BasketRoutingModule } from './basket-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateBasketPopinComponent } from './update-basket-popin/update-basket-popin';

@NgModule({
  declarations: [
    BasketComponent,
    UpdateBasketPopinComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    BasketRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    SharedModule
  ]
})
export class BasketModule { }
