import {Component} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import { Observable } from 'rxjs';
import { AppStateService } from 'src/@core/services/app-state.service';

@Component({
    selector: 'app-faq-buyer',
    templateUrl: './faq-buyer.component.html',
    styleUrls: ['./faq-buyer.component.scss']
})
export class FaqBuyerComponent {

    $language : Observable<string>;
    constructor(private state : AppStateService) {
        this.$language = this.state.language;
    }
}
