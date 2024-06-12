import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private _language: BehaviorSubject<string>;

  constructor(private translate: TranslateService) {
    this._initLanguage();
  }

  get language() {
    return this._language.asObservable();
  }

  set language(obsString) {
    obsString.pipe(take(1)).subscribe(ele => {
      if (ele === this._language.value) return;
      this._language.next(ele);
      localStorage.setItem('language', ele);
      this.translate.use(ele);
    });
  }

  init() {
    this._initLanguage();
  }

  private _initLanguage() {
    const lang = localStorage.getItem('language') ?? 'fr';
    this._language = new BehaviorSubject<string>(lang);
    this.translate.use(lang);
    this.language = of(lang);
    localStorage.setItem('language', lang)
  }
}
