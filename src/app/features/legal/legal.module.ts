import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LegalRoutingModule} from './legal-routing.module';
import {LegalComponent} from './legal.component';
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {CguFrComponent} from "./cgu/partials/cgu-fr/cgu-fr.component";
import {CguEnComponent} from "./cgu/partials/cgu-en/cgu-en.component";
import {CguComponent} from "./cgu/cgu.component";


@NgModule({
    declarations: [
        LegalComponent,
        CguComponent,
        CguFrComponent,
        CguEnComponent,
    ],
    imports: [
        CommonModule,
        LegalRoutingModule,
        NgbAccordionModule,
        SharedModule
    ]
})
export class LegalModule {
}
