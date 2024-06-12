import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {FaqBuyerFrComponent} from './partials/buyer/faq-fr/faq-fr.component';
import {FaqBuyerComponent} from './faq-buyer/faq-buyer.component';
import {FaqBuyerEnComponent} from './partials/buyer/faq-en/faq-en.component';
import {FaqSellerComponent} from "./faq-seller/faq-seller.component";
import {FaqSellerFrComponent} from "./partials/seller/faq-fr/faq-fr.component";
import {FaqSellerEnComponent} from "./partials/seller/faq-en/faq-en.component";
import {NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
    declarations: [
        FaqBuyerFrComponent,
        FaqBuyerEnComponent,
        FaqBuyerComponent,
        FaqSellerComponent,
        FaqSellerFrComponent,
        FaqSellerEnComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: "",
                pathMatch: "full",
                redirectTo: "seller"
            },
            {
                path: "buyer",
                component: FaqBuyerComponent
            },
            {
                path: "seller",
                component: FaqSellerComponent
            }
        ]),
        NgbAccordionModule,
        SharedModule
    ]
})
export class FaqModule {
}
