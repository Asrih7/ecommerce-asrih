import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    endpoint = 'product/';
    constructor(private httpClient: HttpClient) { }

    getCategories(): Observable<any[]> {
        return this.httpClient.get<any[]>(`${environment.url}/${this.endpoint}category/`);
    }

    getTopLevelCategories(): Observable<any[]> {
        return this.httpClient.get<any[]>(`${environment.url}/${this.endpoint}top-category/`);
    }
}
