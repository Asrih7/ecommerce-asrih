import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormGeneric } from 'src/@core/models/form-generic';
import { PROFILE_FORM } from 'src/@core/models/form.model';
import { Profile } from 'src/@core/models/profile';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { UserService } from 'src/@core/services/user.service';
import { MaskedDate, dateFormatByLangue, inputDateFormatByLangue } from 'src/@core/utils/helpers';
import { ShortDatePipe } from '../../pipes/short-date.pipe';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Subject, takeUntil } from 'rxjs';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import _ from 'lodash';
import { AlertsService } from 'src/@core/services/alerts.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  @Input() showEmailConfirmation = false;
  @Input() showMoveToNext = false;
  @Output() mouveToNext = new EventEmitter();

  public profile: Profile | null;
  public oldProfile: Profile | null;
  public profileFields: any[] = [];
  public today: any = new Date().toISOString().slice(0, 10);
  public valDate: any;
  public alreadyConfirmed = true;
  public form: FormGeneric = new FormGeneric(this.fb);
  public genderList: any = [];
  public languageList: any = [];
  public dateMask: any;
  public imgProfile: any;
  public errors: any = [];
  public isEmailConfirmed: any;
  public dateFormat: any;
  public inputFormatDate: any;
  public getMsgConfirmationSend = false;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    private alertsService: AlertsService,
    private settingsService: RegionalSettingsService,
    private fb: FormBuilder,
    private shortDatePipe: ShortDatePipe,
    private fieldsControl: GenerateInformationsService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private imageCompress: NgxImageCompressService
  ) {
    this.form.group = this.fb.group(PROFILE_FORM);
  }

  ngOnInit(): void {
    this.dateMask = MaskedDate;
    this.getUserProfile();
    this.getUserProfilefields();

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: settings => {
          if (settings?.language) {
            this.dateMask = MaskedDate;
            this.getUserProfilefields();
            this.constructProfileForm(this.profile);
          }
        }
      });
  }

  getUserProfile(): void {
    this.userService.profile$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: profile => {
          this.profile = profile as Profile;
          this.constructProfileForm(this.profile);
        },
        error: error => {
          this.profile = null;
          this.constructProfileForm(this.profile);
        }
      });
  }

  getUserProfilefields(): any {
    this.fieldsControl.getInformationUserById().subscribe((fields) => {
      this.profileFields = [];
      const list = fields.actions.GET;
      for (const [key, value] of Object.entries(list)) {
        this.profileFields = [...this.profileFields, { key, value }];

        switch (key) {
          case 'gender':
            this.genderList = (value as any)?.choices;
            break;
          case '_language':
            this.languageList = (value as any)?.choices;
            break;
          default:
            break;
        }
      }

      this.isEmailConfirmed = this.profileFields.filter((field: any) => field.key === 'is_email_confirmed');
      this.profileFields = this.profileFields.filter(
        field => !field.value.read_only && !['marketing_permission', 'default_shipping_address', 'default_billing_address', 'addresses'].includes(field.key)
      );
    });
  }

  constructProfileForm(profile: Profile | null) {
    this.form.group.reset();

    if (profile?.id) {
      this.imgProfile = profile.profile_picture;
      this.form.populateForm(profile);
      this.alreadyConfirmed = profile.is_email_confirmed || false;
      const lang = localStorage.getItem('language');
      this.inputFormatDate = lang === 'en' ? 'YYYY-MM-DD' : 'DD-MM-YYYY';
      this.dateFormat = lang === 'en' ? 'yyyy-MM-dd' : 'dd-MM-yyyy';
      this.valDate = this.datePipe.transform(new Date(this.form.group.get('birth_date')?.value), this.dateFormat);
      this.form.group.get('birth_date')?.setValue(this.valDate);
    }
  }

  editInfos(): void {
    this.errors = [];
    if (this.form.group.get('phone')?.value) {
      this.form.group.get('phone')?.setValue(this.form.group.get('phone')?.value.internationalNumber);
    }

    let editedProfile = {} as Profile;
    this.form.assign(editedProfile);
    delete editedProfile.profile_picture;
    if (editedProfile.birth_date) {
      if (typeof editedProfile.birth_date == 'string' && localStorage.getItem('language') == 'fr') {
        const dateParts = editedProfile.birth_date.split('-');
        editedProfile.birth_date = this.shortDatePipe.transform(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`, 'yyyy-MM-dd');
      } else {
        editedProfile.birth_date = this.shortDatePipe.transform(editedProfile.birth_date, 'yyyy-MM-dd');
      }
    }

    this.userService.patchProfil(this.profile?.id, editedProfile)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: profile => {
          if (profile) {
            this.userService.setProfile(profile);
            this.alertsService.messageSuccess(this.translate.instant('header.profil'));

            if (this.showMoveToNext == true) {
              this.mouveToNext.emit();
            }
          }
        },
        error: err => {
          this.errors = [];
          if (err.status === 400) {
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
            }
          } else if (err.status === 500 && this.profile?.birth_date && this.profile.birth_date > this.today) {
            const birthdayError = {
              key: 'birth_date',
              value: this.translate.instant('error_about_birthday.birthday_error')
            };

            this.errors.push(birthdayError);
          }
        }
      });
  }

  editPicture(): any {
    this.imageCompress.uploadFile().then(({ image, fileName, orientation }) => {
      this.imageCompress
        .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
        .then(compressedImage => {
          this.imgProfile = compressedImage;
          const imgFile = this.dataURLtoFile(compressedImage, fileName);
          this.editOnlyPicutre(imgFile);
        });
    });
  }

  dataURLtoFile(dataurl: any, filename: any) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      bsLength = bstr.length, //base64 string length
      u8arr = new Uint8Array(bsLength);

    while (bsLength--) {
      u8arr[bsLength] = bstr.charCodeAt(bsLength);
    }

    return new File([u8arr], filename, { type: mime });
  }

  editOnlyPicutre(file: any): any {
    const formData: any = new FormData();
    formData.append('profile_picture', file);
    this.userService.patchProfil(this.profile?.id, formData).subscribe((response: any) => {
      if (response) {
        this.alertsService.messageSuccess(this.translate.instant('header.profil'));
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}