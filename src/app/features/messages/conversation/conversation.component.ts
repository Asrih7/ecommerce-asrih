import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessagesService } from 'src/@core/services/messages.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @Input() messagesConversations: any;
  @Input() profileSelected: any;
  @Input() mixtProfiles: any;
  @Input() activeListProfilesCurrent: any;
  today: any;
  imgConversation: any;
  slideImg: any;
  date: any;
  month: any;
  @Output() handlerChangeConversation: EventEmitter<boolean> = new EventEmitter();
  constructor(private messageService: MessagesService, private datePipe: DatePipe, private translate: TranslateService) { }

  ngOnInit(): void {
    this.today = new Date();
    this.today = this.datePipe.transform(this.today, 'MM-dd');
  }
  formatDateToday(date: any): any {
    date = this.datePipe.transform(date, 'MM-dd');
    this.getMountDate(date);
    return date;
  }
  getMountDate(date: any): any {
    if (date.includes('01-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('02-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('03-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('04-')) {
    } else if (date.includes('05-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('06-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('07-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('08-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('09-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('10-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('11-')) {
      this.getMountInCaracter(date);
    } else if (date.includes('12-')) {
      this.getMountInCaracter(date);
    }
  }
  getMountInCaracter(date: any): any {
    const m = date.split('-')[0];
    this.month = this.translate.instant('mois' + m);
    if (this.month.length > 4) {
      this.month = this.month.substr(0, 3);
    }
    this.date = this.month + '-' + date.split('-')[1];
  }
  handlerEditConversation(profile: any): any {
    this.handlerChangeConversation.emit(profile);
    this.getMessagesConversation(profile);
  }
  getMessagesConversation(profile: any): any {
    this.messageService.getMessages().subscribe(data => {
      if (data) {
        this.messagesConversations = data.filter(message => (message.recipient === profile.recipient && message.sender === profile.sender) || (message.recipient === profile.sender && message.sender === profile.recipient));
        this.messagesConversations = this.messagesConversations.reverse();
      }
    });
  }
  showImage(img: any): any {
    this.slideImg = img;
  }
  closeSlide(): any {
    delete this.slideImg;
  }
}
