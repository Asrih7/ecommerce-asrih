import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Translate } from '../models/models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslateDataService {

  misc = 'misc/';

  constructor(private httpClient: HttpClient) { }
  translate(lignes: any[]): Observable<any>[] {
    const result: any = [];
    lignes.forEach((ligne) => {
      const newLigne = {
        language: ligne.language,
        text: ligne.text
      };
      result.push(this.httpClient.post<Translate>(`${environment.url}/${this.misc}translate/`, newLigne));
    });
    return result;
  }
}
