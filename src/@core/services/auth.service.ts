import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthPayload, Login, Logout } from '../models/models';
import jwt_decode from 'jwt-decode';
import { UserTokens } from '../models/user-tokens';
import { Router } from '@angular/router';

export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public static authUrls = ['/api/token/', '/token/refresh/'];
  private tokens$: BehaviorSubject<UserTokens | null>;
  public userTokens$: Observable<UserTokens | null>;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
    const access = this.getAccessToken();
    const tokens = access ? { id: jwt_decode<AuthPayload>(access).user_id, access } as UserTokens : null;
    this.tokens$ = new BehaviorSubject<UserTokens | null>(tokens);
    this.userTokens$ = this.tokens$.asObservable();
  }

  login(login: Login): Observable<UserTokens | null> {
    return this.httpClient.post<any>(`${environment.url}/token/`, login)
      .pipe(map(t => {
        this.setTokens(t);
        const tokens = { id: jwt_decode<AuthPayload>(t.access).user_id, ...t };
        this.tokens$.next(tokens);
        return tokens;
      }));
  }

  logout(logout: Logout): Observable<any> {
    this.navigateIfForbidden();
    return this.httpClient.post(`${environment.url}/logout/`, logout);
  }

  setLogoutTokens() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    this.tokens$.next(null);
  }

  convertFacebokToken(authSocialToken: string): Observable<any> {
    const body = {
      'grant_type': 'convert_token',
      'client_id': `${environment.SocialClientId}`,
      'client_secret': `${environment.SocialClientIdSecret}`,
      'backend': 'facebook',
      'token': authSocialToken
    };

    return this.httpClient.post(`${environment.urlAuthSocial}/convert-token/`, body)
      .pipe(map((t: any) => {
        this.setTokens({ access: t.access_token, refresh: t.refresh_token });
        const tokens = { refresh: t.refresh_token, access: t.access_token, id: jwt_decode<AuthPayload>(t.access_token).user_id as number | undefined, };
        this.tokens$.next(tokens);
        return tokens;
      }));
  }

  convertGoogleToken(authSocialToken: string): Observable<any> {
    const body = {
      'grant_type': 'convert_token',
      'client_id': `${environment.SocialClientId}`,
      'client_secret': `${environment.SocialClientIdSecret}`,
      'backend': 'google-identity',
      'token': authSocialToken
    };

    return this.httpClient.post(`${environment.urlAuthSocial}/convert-token/`, body)
      .pipe(map((t: any) => {
        this.setTokens({ access: t.access_token, refresh: t.refresh_token });
        const tokens = { refresh: t.refresh_token, access: t.access_token, id: jwt_decode<AuthPayload>(t.access_token).user_id as number | undefined, };
        this.tokens$.next(tokens);
        return tokens;
      }));
  }

  isAuthenticated(): boolean {
    return !this.isTokenExpired(this.getAccessToken()) || !this.isTokenExpired(this.getRefreshToken());
  }

  isValideAccessToken(token: string): boolean {
    return !this.isTokenExpired(token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN) ?? '';
  }

  setTokens(data: any): void {
    localStorage.setItem(ACCESS_TOKEN, data[ACCESS_TOKEN] ?? '');
    localStorage.setItem(REFRESH_TOKEN, data[REFRESH_TOKEN] ?? '');
  }

  getIdOfConnectedUser(): string | undefined {
    const token = this.getAccessToken();
    return token ? jwt_decode<AuthPayload>(token).user_id : '';
  }

  private getTokenExpirationDate(token: string): number | null {
    const decoded = jwt_decode<AuthPayload>(token);
    if (decoded.exp === undefined) {
      return null;
    }
    return decoded.exp;
  }

  private isTokenExpired(token?: string | null): boolean {
    if (!token) {
      token = this.getAccessToken();
    }

    if (!token) {
      return true;
    }

    const tokenExpiration = this.getTokenExpirationDate(token);
    if (tokenExpiration === undefined || tokenExpiration == null) {
      return true;
    }

    const expDate = new Date(tokenExpiration * 1000).valueOf();
    return (new Date().valueOf() > expDate);
  }

  private navigateIfForbidden() {
    const parentPath = this.router.url.split('/')[1];
    if (parentPath) {
      const rootPath = parentPath.split('#')[0];
      const currentConfig = this.router.config.find(c => c.path === rootPath)

      if (currentConfig?.canActivate) {
        this.router.navigate(['/']);
      }
    }
  }

  refreshToken(): Observable<any> {
    const refresh = this.getRefreshToken();
    console.log(refresh);

    return this.httpClient.post(`${environment.url}/token/refresh/`, { refresh: this.getRefreshToken() });
  }
}
