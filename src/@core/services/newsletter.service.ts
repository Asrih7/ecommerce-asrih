import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  endpoint = 'newsletter';

  constructor(
    private httpClient: HttpClient
  ) { }

  submitToNewsLetter(email: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpoint}/subscription/`, { email: email });
  }

  getNewsLetterInfo(): Observable<any> {
    return this.httpClient.options<any>(`${environment.url}/${this.endpoint}/subscription/`);
  }
}
