import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGeneric } from 'src/@core/models/form-generic';
import { CONFIRM_PASSWORD_RESET_FORM } from 'src/@core/models/form.model';
import { ConfirmResetPassword } from 'src/@core/models/setPassword';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { UserService } from 'src/@core/services/user.service';

@Component({
  selector: 'app-confirm-password-reset',
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.scss']
})
export class ConfirmPasswordResetComponent implements OnInit {
  form: FormGeneric = new FormGeneric(this.fb);
  confirmResetPassword = {} as ConfirmResetPassword;
  listFields: any = [];
  errors: any = [];
  token: any;
  uidb64: any;
  constructor(private fieldsControl: GenerateInformationsService, private fb: FormBuilder, private userService: UserService,
    private route: Router, private router: ActivatedRoute, private toaster: ToastrService) {
    this.form.group = this.fb.group(CONFIRM_PASSWORD_RESET_FORM);
  }

  ngOnInit(): void {
    this.readControlFields();
    this.token = this.router.snapshot.params["token"];
    this.uidb64 = this.router.snapshot.params["uidb64"];
  }
  readControlFields(): any {
    this.fieldsControl.getInformationConfirmResetPassword().subscribe((fields) => {
      const list = fields.actions.POST;
      for (const [key, value] of Object.entries(list)) {
        this.listFields = [...this.listFields, { key, value }];
      }
      this.listFields = this.listFields.filter((field: any) => field.key !== 'uidb64' && field.key !== 'token');
    }
    );
  }
  edit(): any {
    this.errors = [];
    this.form.assign(this.confirmResetPassword); 
    this.userService.postConfirmPasswordReset(this.uidb64, this.token, this.confirmResetPassword).subscribe(response => {
      if (response) {
        this.form.group.reset();
        this.toaster.success(response.message);
        this.route.navigate(['/']);
      }
    },
      (err) => {
        if (err.status === 400) {
          for (const [key, value] of Object.entries(err.error)) {
            this.errors = [...this.errors, { key, value }];
            err.error.message?.map((msg: string) => {
              this.toaster.error(msg);
            })
          }
        }
      }
    );
  }
}
