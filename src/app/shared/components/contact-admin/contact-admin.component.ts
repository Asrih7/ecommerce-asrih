import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormGeneric } from 'src/@core/models/form-generic';
import { MESSAGE_ADMIN_FORM } from 'src/@core/models/form.model';
import { MessageToAdmin } from 'src/@core/models/message';
import { AuthService } from 'src/@core/services/auth.service';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { MessagesService } from 'src/@core/services/messages.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import _ from 'lodash';

@Component({
  selector: 'app-contact-admin',
  templateUrl: './contact-admin.component.html',
  styleUrls: ['./contact-admin.component.scss']
})
export class ContactAdminComponent implements OnInit, OnChanges {
  @Input() recepientId: number | null;
  @Input() showContactModal: boolean | null;
  @Output() toggleContactModal = new EventEmitter<boolean>();

  public listFields: any = [];
  public form: FormGeneric = new FormGeneric(this.fb);
  public isLoggedIn = false;
  public writeInTextarea = false;
  public errors: any = [];
  public file: any;
  public fileUploaded: any;
  public typeFileUploaded = false;
  public formData: any;
  public formDataNoImage: any;
  public description: any;
  public messageToAdmin = {} as MessageToAdmin;

  constructor(
    private messagesService: MessagesService,
    private settingsService: RegionalSettingsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private fieldsControl: GenerateInformationsService,
    private toaster: ToastrService,
    private translate: TranslateService
  ) {
    this.form.group = this.fb.group(MESSAGE_ADMIN_FORM);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recepientId'] && changes['recepientId'].currentValue != changes['recepientId'].previousValue) {
      this.getContactFields();
    }
  }

  ngOnInit(): void {
    this.isConnectedUser();
    this.settingsService.settingsChange$
      .subscribe({
        next: settings => {
          if (settings?.language) {
            this.getContactFields();
          }
        }
      });
  }

  getContactFields(): any {
    this.listFields = [];
    this.description = '';

    if (this.recepientId) {
      this.fieldsControl.getInformationMessage()
        .subscribe((fields) => {
          const list = fields.actions.POST;
          for (const [key, value] of Object.entries(list)) {
            if (key == 'body' || key == 'file') {
              this.listFields = [...this.listFields, { key, value }];
              if (key === 'body') {
                this.description = value;
              }
            }
          }
        });
    } else {
      this.fieldsControl.getInformationMessageToAdmin()
        .subscribe((fields) => {
          const list = fields.actions.POST;
          for (const [key, value] of Object.entries(list)) {
            this.listFields = [...this.listFields, { key, value }];
            if (key === 'body') {
              this.description = value;
            }
          }
        });
    }
  }

  isConnectedUser(): void {
    this.authService.userTokens$
      .subscribe({
        next: tokens => {
          this.isLoggedIn = !!tokens?.access && this.authService.isValideAccessToken(tokens?.access);
          this.getContactFields();
        }
      })
  }

  clearCache(event: any) {
    event.target.value = null
  }

  sendMessage(): any {
    this.messageToAdmin = this.form.group.value;
    if (this.recepientId) {
      this.sendMessageToRecipient();
    } else {
      this.sendMessageForAnonym();
    }
  }

  submitEvent(event: any): void {
    if (event.keyCode === 13 && this.showContactModal && !this.writeInTextarea) {
      this.sendMessage();
    }
  }

  sendMessageForAnonym(): any {
    this.errors = [];
    if (this.file) {
      this.prepareMessageWithImage(this.messageToAdmin);
      this.messagesService.postMessageToAdmin(this.formData)
        .subscribe({
          next: result => {
            if (result) {
              this.fileUploaded = '';
              this.typeFileUploaded = false;
              this.form.group.reset();
              this.file = undefined;
              this.toggleModal();
              this.toaster.success(this.translate.instant('confirmation_admin.send_message_admin'));
            }
          },
          error: (err) => {
            if (err.status === 400) {
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }];
              }
            }
          }
        })
    } else {
      delete this.messageToAdmin.file;
      this.prepareMessageWithoutImage(this.messageToAdmin);
      this.messagesService.postMessageToAdmin(this.formDataNoImage)
        .subscribe({
          next: result => {
            if (result) {
              this.form.group.reset();
              this.toggleModal();
              this.toaster.success(this.translate.instant('confirmation_admin.send_message_admin'));
            }
          },
          error: (err) => {
            if (err.status === 400) {
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }];
              }
              this.errors = _.uniqBy(this.errors, 'key');
            }
          }
        });
    }
  }

  sendMessageToRecipient(): any {
    this.errors = [];
    if (this.file) {
      this.formData.append('recipient', this.recepientId);
      this.formData.append('body', this.messageToAdmin.body);
      this.formData.append('file', this.file);
      this.messagesService.postMessage(this.formData)
        .subscribe({
          next: result => {
            if (result) {
              this.fileUploaded = '';
              this.typeFileUploaded = false;
              this.form.group.reset();
              this.file = undefined;
              this.toggleModal();
              this.toaster.success(this.translate.instant('confirmation_admin.send_message_admin'));
            }
          },
          error: (err) => {
            if (err.status === 400) {
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }];
              }
            }
          }
        })
    } else {
      delete this.messageToAdmin.file;
      this.prepareMessageWithoutImage(this.messageToAdmin);
      this.formDataNoImage = new FormData();
      this.formDataNoImage.append('recipient', this.recepientId);
      this.formDataNoImage.append('body', this.messageToAdmin.body);
      this.messagesService.postMessage(this.formDataNoImage)
        .subscribe({
          next: result => {
            if (result) {
              this.form.group.reset();
              this.toggleModal();
              this.toaster.success(this.translate.instant('confirmation_admin.send_message_admin'));
            }
          },
          error: (err) => {
            if (err.status === 400) {
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }];
              }
              this.errors = _.uniqBy(this.errors, 'key');
            }
          }
        });
    }
  }

  detectTextarea(e: any): any {
    this.writeInTextarea = true;
  }

  editPicture(e: any): any {
    this.file = undefined;
    this.file = e.target.files[0];
    const reader = new FileReader();
    document.getElementById('msg')?.focus()

    if (this.file.type.includes('image')) {
      this.typeFileUploaded = true;
      reader.onloadend = () => { this.fileUploaded = reader.result; };
    } else {
      this.typeFileUploaded = false;
      this.fileUploaded = this.file.name;
    }

    if (this.file) {
      reader.readAsDataURL(this.file);
    }

    this.formData = new FormData();
  }

  prepareMessageWithImage(message: any): any {
    this.formData.append('email', message.email);
    this.formData.append('name', message.name);
    this.formData.append('body', message.body);
    this.formData.append('file', this.file);
  }

  prepareMessageWithoutImage(message: any): any {
    this.formDataNoImage = new FormData();
    this.formDataNoImage.append('email', message.email);
    this.formDataNoImage.append('name', message.name);
    this.formDataNoImage.append('body', message.body);
  }

  deleteImage(): void {
    this.fileUploaded = '';
    this.typeFileUploaded = false;
    delete this.file;
  }

  toggleModal(): any {
    this.toggleContactModal.emit(!this.showContactModal);
  }
}
