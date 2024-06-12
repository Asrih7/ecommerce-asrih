import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SellComponent } from './sell.component';
import { SellRoutingModule } from './sell-routing.module';

@NgModule({
  declarations: [
    SellComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SellRoutingModule
  ]
})
export class SellModule { }
