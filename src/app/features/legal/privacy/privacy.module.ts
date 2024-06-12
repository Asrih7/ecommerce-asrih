import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from "./privacy.component";
import { RouterModule } from "@angular/router";
import { PrivacyEnComponent } from './partials/privacy-en/privacy-en.component';
import { PrivacyFrComponent } from './partials/privacy-fr/privacy-fr.component';
import { SharedModule } from "../../../shared/shared.module";


@NgModule({
    declarations: [PrivacyComponent, PrivacyEnComponent, PrivacyFrComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{
            path: "",
            component: PrivacyComponent
        }])
    ]
})
export class PrivacyModule {
}
