import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Dispute } from "../models/dispute";


@Injectable({
    providedIn: 'root'
})
export class DisputeService {
    endpoint = 'dispute/dispute/';
    constructor(private httpClient: HttpClient) { }

    getDispute(): Observable<Dispute> {
        return this.httpClient.get<Dispute>(`${environment.url}/${this.endpoint}`);
    }

    postDispute(dispute: any): Observable<Dispute> {
        const body = dispute;
        return this.httpClient.post<Dispute>(`${environment.url}/${this.endpoint}`, body);
    }

    getInformationDispute(): Observable<any> {
        return this.httpClient.options(`${environment.url}/${this.endpoint}`);
    }
}
