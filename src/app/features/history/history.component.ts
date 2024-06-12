import { Component } from '@angular/core';
import { Observable } from "rxjs";
import { AppStateService } from 'src/@core/services/app-state.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  $language : Observable<string>;
  constructor(private state : AppStateService) {
      this.$language = this.state.language;
  }

}
