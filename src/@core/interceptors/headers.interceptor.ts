import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tokenExtractor: HttpXsrfTokenExtractor
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrftoken = this.tokenExtractor.getToken()
    const token = this.authService.getAccessToken() ?? '';

    req = req.clone({ withCredentials: true });

    if (csrftoken != null) {
      req = req.clone({
        headers: req.headers.set("X-CSRFTOKEN", csrftoken),
      });
    }

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(req);
  }
}