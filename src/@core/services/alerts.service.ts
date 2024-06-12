import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  constructor(
    private translate: TranslateService,
    private toaster: ToastrService
  ) { }

  messageError(formTitle: any): any {
    this.toaster.error(formTitle);
  }

  messageSuccess(formTitle: any): any {
    this.toaster.success(formTitle + ' ' + this.translate.instant('information_message.message_modified'));
  }

  messageSuccessInFirst(formTitle: any): any {
    this.toaster.success(formTitle + ' ' + this.translate.instant('information_message.message_added'));
  }

  messageSuccessDelete(formTitle: any): any {
    this.toaster.success(formTitle + ' ' + this.translate.instant('information_message.message_deleted'));
  }
}
