import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';
import { CategoriesComponent } from './header/categories/categories.component';
import { HeaderComponent } from './header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../shared/shared.module';
import { LoginOrRegisterComponent } from './header/login-or-register/login-or-register.component';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { ConsentComponent } from '../features/legal/consent/consent.component';
import { ConsentEnComponent } from '../features/legal/consent/partials/consent-en/consent-en.component';
import { ConsentFrComponent } from '../features/legal/consent/partials/consent-fr/consent-fr.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CategoriesComponent,
    LoginOrRegisterComponent,
    ConsentComponent,
    ConsentEnComponent,
    ConsentFrComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    SocialLoginModule,
    SharedModule

  ],
  exports: [
    HeaderComponent,
    FooterComponent,

  ],
})
export class LayoutModule {
}

