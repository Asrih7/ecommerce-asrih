import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import _ from 'lodash';
import { FormGeneric } from 'src/@core/models/form-generic';
import { MESSAGE_FORM } from 'src/@core/models/form.model';
import { Message } from 'src/@core/models/message';
import { AuthService } from 'src/@core/services/auth.service';
import { MessagesService } from 'src/@core/services/messages.service';

@Component({
  selector: 'app-write-conversation',
  templateUrl: './write-conversation.component.html',
  styleUrls: ['./write-conversation.component.scss']
})
export class WriteConversationComponent implements OnInit {
  modal = false;
  writeInTextarea = false;
  form: FormGeneric = new FormGeneric(this.fb);
  @Input() profileSelected: any;
  @Input() firstProfileAfterLoad: any;
  message = {} as Message;
  messagesConversations: Message[] = [];
  errors: any = [];
  file: any;
  fileUploaded: any;
  typeFileUploaded = false;
  formData: any;
  formDataNoImage: any;
  profileConnected: any;
  id: any;
  @Output() handlerEditConversation: EventEmitter<any> = new EventEmitter();
  constructor(private messagesService: MessagesService, private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form.group = this.fb.group(MESSAGE_FORM);
  }

  ngOnInit(): void {
    this.id = this.authService.getIdOfConnectedUser();
  }
  clearCache(event: any) {
    event.target.value = null
  }
  prepareObjMessage(): any {
    if (this.profileSelected) {
      if (this.profileSelected.recipient === this.id) {
        this.message = {
          body: this.form.group.get('body')?.value,
          file: this.fileUploaded,
          recipient: this.profileSelected.sender,
          recipient_name: this.profileSelected.sender_name,
          sender: this.id
        };
      } else {
        this.message = {
          body: this.form.group.get('body')?.value,
          file: this.fileUploaded,
          recipient: this.profileSelected.recipient,
          recipient_name: this.profileSelected.recipient_name,
          sender: this.id,
        };
      }
    } else {
      this.message = {
        body: this.form.group.get('body')?.value,
        file: this.fileUploaded,
        // recipient: this.profileSelected.recipient,
        // recipient_name: this.profileSelected.recipient_name,
        recipient: '1',
        sender: this.id
      };
    }
  }
  sendMessage(): any {
    this.errors = [];
    this.prepareObjMessage();
    if (this.file) {
      this.prepareMessageWithImage(this.message, this.id);
      this.messagesService.postMessage(this.formData).subscribe(() => {
        this.handlerEditConversation.emit(this.message);
        this.fileUploaded = '';
        this.typeFileUploaded = false;
        this.form.group.reset();
        this.file = undefined;
      },
        (err) => {
          if (err.status === 400) {
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
            }
          }
        }
      );
    } else {
      this.prepareMessageNoImage(this.message, this.id);
      this.messagesService.postMessage(this.formDataNoImage).subscribe(() => {
        this.form.group.reset();
        this.handlerEditConversation.emit(this.message);
      },
        (err) => {
          if (err.status === 400) {
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
            }
          }
        }
      );
    }
  }
  submitEvent(event: any): void {
    if (event.keyCode === 13 && !_.isEmpty(this.profileSelected) && this.writeInTextarea === false) {
      this.sendMessage();
    }
  }
  func(): any {
    this.writeInTextarea = true;
  }
  otherFunc(): any {
    this.writeInTextarea = false;
  }
  detectTextarea(e: any): any {
    this.writeInTextarea = true;
  }
  editPicture(e: any): any {
    this.file = undefined;
    this.file = e.target.files[0];
    const reader = new FileReader();
    document.getElementById("msg")?.focus();
    if (this.file.type.includes('image')) {
      this.typeFileUploaded = true;
      reader.onloadend = () => {
        this.fileUploaded = reader.result;
      };
    } else {
      this.typeFileUploaded = false;
      this.fileUploaded = this.file.name;
    }
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
    this.formData = new FormData();
  }
  prepareMessageWithImage(message: any, id: any): any {
    this.formData.append('body', message.body);
    this.formData.append('recipient', message.recipient);
    this.formData.append('file', this.file);
    this.formData.append('sender', id);
  }
  prepareMessageNoImage(message: any, id: any): any {
    this.formDataNoImage = new FormData();
    if (!_.isEmpty(this.form.group.get('body')?.value)) {
      this.formDataNoImage.append('body', message.body);
    }
    this.formDataNoImage.append('recipient', message.recipient);
    this.formDataNoImage.append('sender', id);
  }
  deleteImage(): void {
    this.fileUploaded = '';
    this.typeFileUploaded = false;
    delete this.file;
  }
}
