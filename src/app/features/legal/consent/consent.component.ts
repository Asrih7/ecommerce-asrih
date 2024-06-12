import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AppStateService } from 'src/@core/services/app-state.service';
@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent {
  showCookie: boolean = false;
  showChoice: boolean = true;
  $language: Observable<string>;
  constructor(private cookieService: CookieService, private state: AppStateService) {
    this.$language = this.state.language;
  }

  ngOnInit(): void {
    this.check()
  }

  check() {
    const check = this.cookieService.check('cookieconsent')
    console.log(check);

    if (check) {
      this.showCookie = false;
    } else {
      this.showCookie = true;
    }
  }

  showChoices() {
    this.showChoice = !this.showChoice
  }

  hideCookie() {
    this.showCookie = false
    console.log(this.showCookie);
    this.cookieService.set('cookieconsent', 'yes');

  }

  backStep() {
    this.showChoice = !this.showChoice
  }
}
