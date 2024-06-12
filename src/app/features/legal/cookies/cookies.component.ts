import { Component, Input, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AppStateService } from 'src/@core/services/app-state.service';
@Component({
  selector: 'app-consent',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent {
  showCookie: boolean = false;
  showChoice: boolean = true;
  $language: Observable<string>;
  constructor(
    private cookieService: CookieService,
    private state: AppStateService
  ) {
    this.$language = this.state.language;
  }
  ngOnInit(): void {

  }
}
