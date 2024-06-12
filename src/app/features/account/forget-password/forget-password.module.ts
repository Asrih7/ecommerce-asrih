import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ForgetPasswordComponent } from './forget-password.component';
import { ForgetPasswordRoutingModule } from './forget-password-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ForgetPasswordRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ForgetPasswordModule { }
