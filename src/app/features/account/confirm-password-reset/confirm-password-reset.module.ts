import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmPasswordResetRoutingModule } from './confirm-password-reset-routing.module';
import { ConfirmPasswordResetComponent } from './confirm-password-reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ConfirmPasswordResetComponent
  ],
  imports: [
    CommonModule,
    ConfirmPasswordResetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class ConfirmPasswordResetModule { }
