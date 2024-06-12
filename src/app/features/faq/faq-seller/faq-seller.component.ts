import {Component} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import { Observable } from 'rxjs';
import { AppStateService } from 'src/@core/services/app-state.service';

@Component({
    selector: 'app-faq-seller',
    templateUrl: './faq-seller.component.html',
    styleUrls: ['./faq-seller.component.scss']
})
export class FaqSellerComponent {
    
    $language : Observable<string>;
    constructor(private state : AppStateService) {
        this.$language = this.state.language;
    }
}
