import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateShopRoutingModule } from './update-shop-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromotionShopComponent } from './promotion-shop/promotion-shop.component';
import { EditDetailShopComponent } from './edit-shop/edit-shop.component';
import { ProductsShopComponent } from './products-shop/products-shop.component';
import { DiscountShopComponent } from './discount-shop/discount-shop.component';
import { DeliveryShopComponent } from './delivery-shop/delivery-shop.component';
import { TranslateModule } from '@ngx-translate/core';
import { UpdateShopComponent } from './update-shop.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    UpdateShopComponent,
    DeliveryShopComponent,
    DiscountShopComponent,
    EditDetailShopComponent,
    ProductsShopComponent,
    PromotionShopComponent
  ],
  imports: [
    CommonModule,
    UpdateShopRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    TranslateModule,
    NgxPaginationModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDialogModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class UpdateShopModule { }
