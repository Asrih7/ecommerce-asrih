import {Component} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import { Observable } from 'rxjs';
import { AppStateService } from 'src/@core/services/app-state.service';

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
    $language : Observable<string>;
    constructor(private state : AppStateService) {
        this.$language = this.state.language;
    }
  
}
