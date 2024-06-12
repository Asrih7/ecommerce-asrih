import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { mobileConversation } from 'src/@core/utils/helpers';

@Component({
  selector: 'app-list-profiles',
  templateUrl: './list-profiles.component.html',
  styleUrls: ['./list-profiles.component.scss']
})
export class ListProfilesComponent implements OnInit {
  @Input() mixtProfiles: any;
  @Input() newArrNotReadByPRofile: any;
  @Input() newArrNotReadByPRofileSender: any;
  @Output() handlerConversationId: EventEmitter<any> = new EventEmitter();

  listSearchProfiles: any = [];
  id: any;
  constructor() { }

  ngOnInit(): void {
    mobileConversation();
  }

  currentConversation(profile: any): any {
    if (profile) {
      if (!profile.hasOwnProperty('sender_profil')) {
        this.id = profile.recipient;
      } else {
        this.id = profile.sender;
      }

      this.handlerConversationId.emit(profile);
    }
  }

  handlerSearchProfiles(data: any): any {
    this.listSearchProfiles = data;
  }
}
