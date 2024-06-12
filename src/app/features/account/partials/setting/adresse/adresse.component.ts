import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Profile } from 'src/@core/models/profile';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { UserService } from 'src/@core/services/user.service';

@Component({
  selector: 'app-adresse',
  templateUrl: './adresse.component.html',
  styleUrls: ['./adresse.component.scss']
})
export class AdresseComponent implements OnInit, OnDestroy {
  public listFields: any = [];
  public listCountries: any = [];
  public profile: Profile;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private fieldsControl: GenerateInformationsService,
    private settingsService: RegionalSettingsService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getProfileInfo();
    this.getAdressesFields();

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (settings: any) => {
          if (settings?.language) {
            this.getAdressesFields();
          }
        }
      });
  }

  getProfileInfo(): void {
    this.userService.profile$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(profile => {
        if (profile) {
          this.profile = profile;
        }
      });
  }

  getAdressesFields(): any {
    this.listFields = [];
    this.fieldsControl.getInformationAddress()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (fields: any) => {
          const list = fields.actions.POST;
          for (const [key, value] of Object.entries(list)) {
            if (!['name_ext', 'company_name', 'longitude', 'latitude', 'id'].includes(key) && !(value as any)?.read_only) {
              this.listFields = [...this.listFields, { key, value }];
            }

            if (key === 'country') {
              this.listCountries = (value as any)?.choices ?? [];
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
