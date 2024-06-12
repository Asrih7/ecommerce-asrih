import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'src/@core/models/message';

@Component({
  selector: 'app-search-profile',
  templateUrl: './search-profile.component.html',
  styleUrls: ['./search-profile.component.scss']
})
export class SearchProfileComponent implements OnInit {
  @Input() mixtProfiles: any;
  @Output() handlerSearchProfiles: EventEmitter<Message[]> = new EventEmitter();
  listProfilesInSearch: Message[] = [];
  constructor() { }

  ngOnInit(): void {
  }
  searchProfiles(e: any): any {
    this.listProfilesInSearch = this.mixtProfiles.filter((item: any) => (item.recipient_name.toLowerCase().startsWith(e.target.value.toLowerCase())) || (item.sender_name.toLowerCase().startsWith(e.target.value.toLowerCase())));
    this.handlerSearchProfiles.emit(this.listProfilesInSearch);
  }
}
