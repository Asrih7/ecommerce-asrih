import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message, MessageToAdmin, PopulateMessage } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  endpoint = 'messaging/';
  private messagesSub$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(false);
  public messagesChange$: Observable<boolean | null> = this.messagesSub$.asObservable();

  private openContactModalSub$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public openContactModal$: Observable<number | null> = this.openContactModalSub$.asObservable();

  constructor(private httpClient: HttpClient) { }

  getMessages(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.url}/${this.endpoint}message/`);
  }

  getMessageById(id: any): Observable<any[]> {
    return this.httpClient.get<any>(`${environment.url}/${this.endpoint}message/${id}/`);
  }

  postMessage(message: Message): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpoint}message/`, message);
  }

  postPopulateMessage(populateMessage: PopulateMessage): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpoint}populate-read_at/`, populateMessage)
      .pipe(tap(m => { this.messagesSub$.next(true) }));
  }

  postMessageToAdmin(messageToAdmin: MessageToAdmin): Observable<any> {
    return this.httpClient.post<any>(`${environment.url}/${this.endpoint}message-admin/`, messageToAdmin);
  }

  openContactModal(recipient: number | null) {
    this.openContactModalSub$.next(recipient);
  }
}
