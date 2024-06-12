import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshAccessTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private authService: AuthService,
        private translate: TranslateService,
        private alertsService: AlertsService
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isAuthUrls = AuthService.authUrls.filter(u => request.url.includes(u)).length > 0;

        return next.handle(request).pipe(
            catchError(error => {
                if (error.status === 500) {
                    this.alertsService.messageError(this.translate.instant('state.error'));
                    return throwError(() => new Error(error));
                }
                else if (error.status === 401 && !isAuthUrls) {
                    if (this.isRefreshing) {
                        return this.refreshAccessTokenSubject.pipe(
                            filter(token => token !== null),
                            take(1),
                            switchMap(() => next.handle(this.addAuthorizationHeader(request, this.authService.getAccessToken())))
                        );
                    } else {
                        // Queue up the failed request and start a new refresh token request
                        this.isRefreshing = true;
                        this.refreshAccessTokenSubject.next(null);
                        return this.authService.refreshToken().pipe(
                            switchMap(newTokens => {
                                this.authService.setTokens(newTokens);
                                this.refreshAccessTokenSubject.next(newTokens.access);
                                return next.handle(this.addAuthorizationHeader(request, newTokens.access));
                            }),
                            catchError(refreshError => {
                                this.authService.setTokens({});
                                return throwError(() => error);
                            }),
                            tap({
                                complete: () => {
                                    this.isRefreshing = false;
                                },
                                error: () => {
                                    this.isRefreshing = false;
                                }
                            }));
                    }
                }
                else {
                    return throwError(() => error);
                }
            }),
        );
    }

    private addAuthorizationHeader(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
}


