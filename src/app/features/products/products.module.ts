import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductSheetComponent } from './product-sheet/product-sheet.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActiveFiltersComponent } from './active-filters/active-filters.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductSheetComponent,
    SearchModalComponent,
    ActiveFiltersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    ProductsRoutingModule,
    NgxPaginationModule,
    CarouselModule,
    MatSliderModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule
  ],
  schemas: []
})
export class ProductsModule { }
