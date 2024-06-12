import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GenerateInformationsService {
  endpoint = 'token/';
  endpointMisc = 'misc/';
  endpointUser = 'user/';
  endpointMessage = 'messaging/';

  constructor(private http: HttpClient) { }

  getInformationAddress(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointMisc}address/`);
  }

  getInformationUser(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointUser}user/`);
  }

  getInformationToken(): Observable<any> {
    return this.http.options(`${environment.url}/token/`);
  }

  getInformationUserById(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointUser}user/current/`);
  }

  getInformationSetPassword(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointUser}set-password/`);
  }

  getInformationSetEmail(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointUser}set-email/`);
  }

  getInformationRegionalSettings(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointMisc}regional-settings/`);
  }

  getInformationPasswordReset(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointUser}password-reset/`);
  }

  getInformationConfirmResetPassword(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointUser}confirm-password-reset/1/1/`);
  }

  getInformationMessageToAdmin(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointMessage}message-admin/`);
  }

  getInformationMessage(): Observable<any> {
    return this.http.options(`${environment.url}/${this.endpointMessage}message/`);
  }

  getCountryMapInfos(): Observable<any> {
    return this.http.get(`${environment.url}/${this.endpointMisc}country-map/`);
  }

  getRegionMapInfos(): Observable<any> {
    return this.http.get(`${environment.url}/${this.endpointMisc}region-map/`);
  }
}
