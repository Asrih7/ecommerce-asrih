import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FilterSectionComponent } from './partials/filter-section/filter-section.component';
import { NewsletterSectionComponent } from './partials/newsletter-section/newsletter-section.component';
import { SubscriptionSectionComponent } from './partials/subscription-section/subscription-section.component';
import { SellerSectionComponent } from './partials/seller-section/seller-section.component';
import { AboutSectionComponent } from './partials/about-section/about-section.component';
import { NewProductsSectionComponent } from './partials/new-products-section/new-products-section.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    HomeComponent,
    FilterSectionComponent,
    NewsletterSectionComponent,
    SubscriptionSectionComponent,
    SellerSectionComponent,
    AboutSectionComponent,
    NewProductsSectionComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslateModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    MatTooltipModule
  ]
})
export class HomeModule { }
