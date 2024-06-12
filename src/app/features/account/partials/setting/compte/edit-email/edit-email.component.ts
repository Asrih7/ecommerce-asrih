import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { FormGeneric } from 'src/@core/models/form-generic';
import { SET_EMAIL_FORM } from 'src/@core/models/form.model';
import { SetEmailPartial } from 'src/@core/models/setPassword';
import { AlertsService } from 'src/@core/services/alerts.service';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { UserService } from 'src/@core/services/user.service';

@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.scss']
})
export class EditEmailComponent implements OnInit, OnDestroy {
  public setEmail = {} as SetEmailPartial;
  public form: FormGeneric = new FormGeneric(this.fb);
  public errors: any = [];
  public listFields: any = [];
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private fieldsControl: GenerateInformationsService,
    private alertsService: AlertsService
  ) {
    this.form.group = this.fb.group(SET_EMAIL_FORM);
  }

  ngOnInit(): void {
    this.readControlFields();
  }

  readControlFields(): any {
    this.listFields = [];
    this.fieldsControl.getInformationSetEmail()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((fields) => {
        const list = fields.actions.POST;
        for (const [key, value] of Object.entries(list)) {
          this.listFields = [...this.listFields, { key, value }];
        }
      });
  }

  editEmail(): void {
    this.errors = [];
    this.form.assign(this.setEmail);
    this.userService.patchSetEmail(this.setEmail)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: response => {
          if (response) {
            this.form.group.reset();
            this.form.group.get('current_email')?.setValue(this.setEmail.new_email1);
            this.alertsService.messageSuccess(this.translate.instant('set_email.title'));
          }
        },
        error: (err) => {
          if (err.status === 400) {
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}

