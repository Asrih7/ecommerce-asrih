import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegionalSettings } from '../models/regionalSettings';

@Injectable({ providedIn: 'root' })
export class RegionalSettingsService {
  endpointMisc = 'misc/';
  private settingsChangeSubject$ = new Subject<any>();
  public settingsChange$ = this.settingsChangeSubject$.asObservable();

  private regionalSettingsSubject$ = new BehaviorSubject<any>(null);
  public regionalSettings$ = this.regionalSettingsSubject$.asObservable();

  private listCountriesSubject$ = new BehaviorSubject<any[]>([]);
  public listCountries$ = this.listCountriesSubject$.asObservable();

  private listCurrenciesSubject$ = new BehaviorSubject<any[]>([]);
  public listCurrencies$ = this.listCurrenciesSubject$.asObservable();

  // TODO Specifi all return types
  constructor(private httpClient: HttpClient) { }

  updateReginalSettings(settings: RegionalSettings): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpointMisc}regional-settings/`, settings, { observe: 'response' });
  }

  getReginalSettings(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpointMisc}regional-settings/`);
  }

  setSettingsChange(settings: any) {
    this.settingsChangeSubject$.next(settings)
  }

  setRegionalSettings(settings: any) {
    this.regionalSettingsSubject$.next(settings)
  }

  setCurrenciesList(list: any[]) {
    this.listCurrenciesSubject$.next(list)
  }

  setCountriesList(list: any[]) {
    this.listCountriesSubject$.next(list)
  }
}
