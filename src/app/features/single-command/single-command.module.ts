import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleCommandRoutingModule } from './single-command-routing.module';
import { SingleCommandComponent } from './single-command.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SingleCommandComponent
  ],
  imports: [
    CommonModule,
    SingleCommandRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SingleCommandModule { }
