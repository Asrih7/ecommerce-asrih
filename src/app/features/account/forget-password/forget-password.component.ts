import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FormGeneric } from '../../../../@core/models/form-generic';
import { RECOVER_PASSWORD_FORM } from '../../../../@core/models/form.model';
import { RecoverPassword } from '../../../../@core/models/recoverPassword';
import { GenerateInformationsService } from '../../../../@core/services/generate-informations.service';
import { UserService } from 'src/@core/services/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {

  form: any;
  recoverPassword = {} as RecoverPassword;
  loaderState = false;
  validate = false;
  errors: any = [];
  listFields: any = [];
  behavoirSubscribe: Subscription[] = [];
  constructor(private userService: UserService, private fb: FormBuilder, private toaster: ToastrService,
    private translate: TranslateService, private fieldsControl: GenerateInformationsService) {
  }

  ngOnInit(): void {
    this.form = new FormGeneric(this.fb);
    this.form.group = this.fb.group(RECOVER_PASSWORD_FORM);
    this.readControlFields();

  }
  readControlFields(): any {
    this.loaderState = true
    this.behavoirSubscribe.push(this.fieldsControl.getInformationPasswordReset().subscribe({
      next: (fields) => {
        this.loaderState = false
        const list = fields.actions.POST;
        for (const [key, value] of Object.entries(list)) {
          this.listFields = [...this.listFields, { key, value }];
        }
      },
      error: err => {
        this.loaderState = false
      }
    }
    ));
  }
  edit(): any {
    this.errors = [];
    this.form.assign(this.recoverPassword);
    this.behavoirSubscribe.push(this.userService.resetPassword(this.recoverPassword).subscribe({
      next: (response) => {
        if (response) {
          this.form.group.reset();
          this.toaster.success(response.message);
        }
      },
      error: (err) => {
        if (err.status === 400) {
          for (const [key, value] of Object.entries(err.error)) {
            this.errors = [...this.errors, { key, value }];
          }
        }
      }
    }
    ));
  }
  ngOnDestroy(): void {
    this.behavoirSubscribe.map((subject) => subject.unsubscribe());
  }

}
