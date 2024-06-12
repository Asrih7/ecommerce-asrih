import { Component } from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import { Observable } from 'rxjs';
import { AppStateService } from 'src/@core/services/app-state.service';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.scss']
})
export class CguComponent {
  $language : Observable<string>;
  constructor(private state : AppStateService) {
      this.$language = this.state.language;
  }

}
