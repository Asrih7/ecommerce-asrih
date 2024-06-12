import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HistoryRoutingModule} from './history-routing.module';
import {HistoryComponent} from './history.component';
import {TranslateModule} from '@ngx-translate/core';
import {HistoryFrComponent} from './history-fr/history-fr.component';
import {HistoryEnComponent} from './history-en/history-en.component';


@NgModule({
    declarations: [
        HistoryFrComponent,
        HistoryEnComponent,
        HistoryComponent,
    ],
    imports: [
        CommonModule,
        HistoryRoutingModule,
        TranslateModule,
    ]
})
export class HistoryModule {
}
