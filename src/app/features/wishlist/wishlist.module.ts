import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishlistRoutingModule } from './wishlist-routing.module';
import { WishlistComponent } from './wishlist.component';
import { StoreWishlistComponent } from './partials/store-wishlist/store-wishlist.component';
import { ArticlesWishlistComponent } from './partials/articles-wishlist/articles-wishlist.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    WishlistComponent,
    StoreWishlistComponent,
    ArticlesWishlistComponent
  ],
  imports: [
    CommonModule,
    WishlistRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class WishlistModule { }
