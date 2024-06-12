import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormGeneric } from 'src/@core/models/form-generic';
import { SET_PASSWORD_FORM } from 'src/@core/models/form.model';
import { SetPasswordPartial } from 'src/@core/models/setPassword';
import { AlertsService } from 'src/@core/services/alerts.service';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { UserService } from 'src/@core/services/user.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit {
  setPassword = {} as SetPasswordPartial;
  form: FormGeneric = new FormGeneric(this.fb);
  errors: any = [];
  editInput = true;
  listFields: any = [];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private fieldsControl: GenerateInformationsService,
    private translate: TranslateService,
    private alertsService: AlertsService
  ) {
    this.form.group = this.fb.group(SET_PASSWORD_FORM);
  }

  ngOnInit(): void {
    this.readControlFields();
  }

  readControlFields(): any {
    this.fieldsControl.getInformationSetPassword().subscribe((fields) => {
      const list = fields.actions.POST;
      for (const [key, value] of Object.entries(list)) {
        this.listFields = [...this.listFields, { key, value }];
      }
    }
    );
  }

  editPassword(): void {
    this.errors = [];
    this.form.assign(this.setPassword);
    this.userService.patchSetPassword(this.setPassword).subscribe(response => {
      if (response) {
        this.form.group.reset();
        this.alertsService.messageSuccess(this.translate.instant('set_password.title'));
      }
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
