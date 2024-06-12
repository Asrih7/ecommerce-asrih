import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profile } from '../models/profile';
import { RecoverPassword } from '../models/recoverPassword';
import { ConfirmResetPassword, SetEmailPartial, SetPasswordPartial } from '../models/setPassword';
import { UserRegister } from '../models/userRegister';

@Injectable({ providedIn: 'root' })
export class UserService {
  endpointUser = 'user/';
  private profileSub$: BehaviorSubject<Profile | null> = new BehaviorSubject<Profile | null>(null);
  public profile$: Observable<Profile | null> = this.profileSub$.asObservable();

  constructor(private httpClient: HttpClient) { }

  register(user: UserRegister): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpointUser}user/`, user);
  }

  checkUser(email: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpointUser}check-user/`, { email: email });
  }

  getUserCurrent(): Observable<any> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpointUser}${this.endpointUser}current/`)
      .pipe(tap(pofile => {
        this.profileSub$.next(pofile);
      }));
  }

  patchProfil(id: any, profile: Profile): Observable<any> {
    return this.httpClient.patch<any>(`${environment.url}/${this.endpointUser}${this.endpointUser}${id}/`, profile);
  }

  putProfil(id: any, profile: Profile): Observable<any> {
    return this.httpClient.put<any>(`${environment.url}/${this.endpointUser}${this.endpointUser}${id}/`, profile);
  }

  getConfirmPasswordReset(uidb64: string, token: string): Observable<ConfirmResetPassword> {
    return this.httpClient.get<ConfirmResetPassword>(`${environment.url}/${this.endpointUser}confirm-password-reset/${uidb64}/${token}/`);
  }

  postConfirmPasswordReset(uidb64: string, token: string, confirmResetPassword: ConfirmResetPassword): Observable<ConfirmResetPassword> {
    return this.httpClient.post<ConfirmResetPassword>(`${environment.url}/${this.endpointUser}confirm-password-reset/${uidb64}/${token}/`, confirmResetPassword);
  }

  patchSetPassword(setPasswordPartial: SetPasswordPartial): Observable<SetPasswordPartial> {
    return this.httpClient.patch<SetPasswordPartial>(`${environment.url}/${this.endpointUser}set-password/`, setPasswordPartial);
  }

  resetPassword(recoverPassword: RecoverPassword): Observable<RecoverPassword> {
    return this.httpClient.post<RecoverPassword>(`${environment.url}/${this.endpointUser}password-reset/`, recoverPassword);
  }

  patchSetEmail(setEmailPartial: SetEmailPartial): Observable<SetEmailPartial> {
    return this.httpClient.patch<SetEmailPartial>(`${environment.url}/${this.endpointUser}set-email/`, setEmailPartial);
  }

  setProfile(profile: Profile) {
    this.profileSub$.next(profile);
  }
}
