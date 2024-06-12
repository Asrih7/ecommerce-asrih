import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../../shared/shared.module";
import { CookiesComponent } from "./cookies.component";
import { CookiesEnComponent } from './partials/cookies-en/cookies-en.component';
import { CookiesFrComponent } from './partials/cookies-fr/cookies-fr.component';

@NgModule({
    declarations: [
        CookiesComponent,
        CookiesEnComponent,
        CookiesFrComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{
            path: "",
            component: CookiesComponent
        }])
    ]
})
export class cookiesModule {
}
