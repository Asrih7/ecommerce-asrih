import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Message } from 'src/@core/models/message';
import { AuthService } from 'src/@core/services/auth.service';
import { MessagesService } from 'src/@core/services/messages.service';
import _ from 'lodash';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  constructor(
    private messageService: MessagesService,
    private authService: AuthService
  ) { }

  messages: Message[] = [];
  messagesConversations: Message[] = [];
  profiles: Message[] = [];
  profileSender: Message[] = [];
  mixtProfiles: Message[] = [];
  populateMessage: any;
  profileSelected: any;
  id: any;
  ids: any = [];
  messagesNotReadForThisPofile: any;
  messagesNotReadForAllPofile: any;
  messagesNotReadForAllPofileSender: any;
  allMessagesNotRead: any;
  today: any;
  nbrMsgNotReadByProfile: any = [];
  profileWithMsg: any = [];
  newArrNotReadByPRofile: any = [];
  newArrNotReadByPRofileSender: any = [];
  showBlock = false;
  innerWidth = 0;

  private _unsubscribeAll: Subject<any> = new Subject();

  ngOnInit(): void {
    this.innerWidth = window.innerWidth

    window.addEventListener('resize', () => {
      this.innerWidth = window.innerWidth
      if (this.innerWidth > 950) {
        this.showBlock = true
      } else {
        this.showBlock = false
      }

    });

    this.today = new Date();
    this.id = this.authService.getIdOfConnectedUser();
    this.getAllMessages();
  }

  getAllMessages(): any {
    this.messageService.getMessages()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        if (data) {
          this.messages = data;
          this.getListProfils(this.messages);
          this.getAllMessageNotRead(this.messages);
        }
      });
  }

  getAllMessageNotRead(messages: any): any {
    this.allMessagesNotRead = messages.filter((conversation: any) => (conversation.recipient === this.id && conversation.read_at === null));
  }

  getListProfils(messages: any): any {
    if (this.messages && !_.isEmpty(this.messages)) {
      this.profiles = messages.filter((profile: any) => (profile.recipient !== this.id && profile.sender === this.id && profile.recipient !== null));
      this.profiles = _.uniqBy(this.profiles, 'recipient');
      this.profiles = _.sortBy(this.profiles, 'id');
      this.profileSender = messages.filter((profile: any) => (profile.recipient === this.id && profile.sender !== this.id));
      this.profileSender = _.uniqBy(this.profileSender, 'sender');
      this.profileSender = _.sortBy(this.profileSender, 'id');
      this.profileSender.forEach((item: any) => {
        item['sender_profil'] = 'yes';
      });

      this.profiles.forEach(p => {
        this.profileSender.forEach((s, index) => {
          if (p.recipient_name === s.sender_name && p.recipient === s.sender) {
            this.profileSender.splice(index, 1);
          }
        });
      });

      this.mixtProfiles = this.profiles.concat(this.profileSender);
      this.mixtProfiles = _.orderBy(this.mixtProfiles, 'id', 'desc');
    }

    if (this.profiles.length) {
      this.getNbrMsgNotReadByProfile(this.profiles);
    }

    if (this.profileSender.length) {
      this.getNbrMsgNotReadByProfileSender(this.profileSender);
    }
  }

  getNbrMsgNotReadByProfile(profiles: any): any {
    this.messagesNotReadForAllPofile = this.messages.filter(conversation => (conversation.recipient === this.id && conversation.read_at === null));
    this.messagesNotReadForAllPofile = _.chain(this.messagesNotReadForAllPofile).groupBy('sender')
      .map((key) => ({ key, value: key.length })).value();
    this.messagesNotReadForAllPofile.forEach((element: any) => {
      element.key.forEach((el: any) => {
        profiles.forEach((item: any) => {
          if (el.sender === item.recipient) {
            this.newArrNotReadByPRofile.push({ recipient: item.recipient, nbrNotRead: element.value });
            this.newArrNotReadByPRofile = _.uniqBy(this.newArrNotReadByPRofile, 'recipient');
          }
        });
      });
    });
  }

  getNbrMsgNotReadByProfileSender(profiles: any): any {
    this.messagesNotReadForAllPofileSender = this.messages.filter(conversation => (conversation.recipient === this.id && conversation.read_at === null));
    this.messagesNotReadForAllPofileSender = _.chain(this.messagesNotReadForAllPofileSender).groupBy('sender')
      .map((key) => ({ key, value: key.length })).value();
    this.messagesNotReadForAllPofileSender.forEach((element: any) => {
      element.key.forEach((el: any) => {
        profiles.forEach((item: any) => {
          if (el.sender === item.sender) {
            this.newArrNotReadByPRofileSender.push({ sender: item.sender, nbrNotRead: element.value });
            this.newArrNotReadByPRofileSender = _.uniqBy(this.newArrNotReadByPRofileSender, 'sender');
          }
        });
      });
    });
  }

  handlerConversationId(profile: any): any {
    if (this.innerWidth <= 950) {
      this.showBlock = true
    }
    this.profileSelected = profile;
    this.messagesConversations = this.messages.filter(message => (message.recipient === profile.recipient && message.sender === profile.sender) || (message.recipient === profile.sender && message.sender === profile.recipient));
    this.messagesConversations = this.messagesConversations.reverse();
    this.getListProfils(this.messages);
    this.getMsgNotReadForThisProfile(this.messagesConversations);
    this.clearMsgNotReadByProfile(profile);
  }

  clearMsgNotReadByProfile(profile: any): any {
    if (!_.isEmpty(this.newArrNotReadByPRofile)) {
      this.newArrNotReadByPRofile = this.newArrNotReadByPRofile.filter((item: any) => (item.recipient !== profile.recipient));
    } else if (!_.isEmpty(this.newArrNotReadByPRofileSender)) {
      this.newArrNotReadByPRofileSender = this.newArrNotReadByPRofileSender.filter((item: any) => (item.sender !== profile.sender));
    }
  }

  getMsgNotReadForThisProfile(conversations: any): any {
    this.messagesNotReadForThisPofile = conversations.filter((conversation: any) => (conversation.recipient === this.id && conversation.read_at == null));
    if (!_.isEmpty(this.messagesNotReadForThisPofile)) {

      this.messagesNotReadForThisPofile.forEach((element: any) => {
        this.ids.push(element.id);
      });
      this.postPopulateMessage(this.ids, this.today);
      this.messagesNotReadForThisPofile = [];
    }
  }

  postPopulateMessage(ids: any, today: any): any {
    this.populateMessage = {
      message_ids: ids,
      read_at: today
    };
    this.messageService.postPopulateMessage(this.populateMessage)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        if (data) {
          this.handlerConversationId(this.profileSelected);
          this.getAllMessages();
        }
      });
  }

  handlerChangeConversation(profile: any): any {
    if (profile) {
      this.getAllMessages();
      this.handlerConversationId(profile);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
