import { Component, OnInit } from '@angular/core';
import { RegionalSettings } from 'src/@core/models/regionalSettings';
import { AppStateService } from 'src/@core/services/app-state.service';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { cloneHeader } from 'src/@core/utils/helpers';
import { of } from 'rxjs';
import { MessagesService } from 'src/@core/services/messages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public showSettingsModal = false;
  public showContactModal: boolean = false;
  public settings?: RegionalSettings;
  public listFields: any[] = [];
  public errors: any = [];
  public recepientId: number | null;

  constructor(
    private fieldsControl: GenerateInformationsService,
    private settingsService: RegionalSettingsService,
    private messagesService: MessagesService,
    private state: AppStateService
  ) { }

  ngOnInit(): void {
    this.getSettings();
    this.getSettingsFields();
    this.onResize();
    this.openConatcModalListener();
  }

  toggleSettings(toggle: boolean) {
    this.showSettingsModal = toggle;
  }

  getSettingsFields(reload: boolean = false): any {
    this.fieldsControl.getInformationRegionalSettings()
      .subscribe({
        next: (fields) => {
          const list = fields.actions.POST;
          this.listFields = [];
          for (const [key, value] of Object.entries(list)) {
            this.listFields = [...this.listFields, { key, value }];
            if (key == 'currency') {
              this.settingsService.setCurrenciesList((value as any).choices);
            } else if (key == 'country') {
              this.settingsService.setCountriesList((value as any).choices);
            }
          }

          localStorage.setItem("fieldsRegionalSetting", JSON.stringify(this.listFields));
        }
      });
  }

  getSettings(): any {
    const settings = localStorage.getItem("regionalSettings");
    if (settings) {
      this.settings = JSON.parse(settings);
      this.settingsService.setRegionalSettings(this.settings);
      localStorage.setItem("language", this.settings?.language ?? '');

    }
    else {
      this.settingsService.getReginalSettings().subscribe(
        {
          next: response => {
            if (response) {
              this.settings = response;
              localStorage.setItem("regionalSettings", JSON.stringify(this.settings));
              localStorage.setItem("language", this.settings?.language ?? '');
              this.settingsService.setRegionalSettings(this.settings);
            }
          }
        });
    }
  }

  updateSettings(updatedSettings: RegionalSettings): any {
    const prevSettings = { ...this.settings }
    this.settings = { ...updatedSettings }
    this.errors = [];

    this.settingsService.updateReginalSettings(updatedSettings)
      .subscribe(
        {
          next: (response) => {
            if (response) {
              this.toggleSettings(false);
              this.state.language = of(this.settings?.language ?? 'fr');
              localStorage.setItem("regionalSettings", JSON.stringify(this.settings));
              this.settingsService.setRegionalSettings(this.settings);

              localStorage.setItem("language", this.settings?.language ?? 'fr');

              const settings: any = {
                currency: this.settings?.currency !== prevSettings.currency,
                language: this.settings?.language !== prevSettings.language
              }

              if (settings.language) {
                this.getSettingsFields(true);
              }

              if (settings.currency || settings.language) {
                this.settingsService.setSettingsChange(settings);
              }
            }
          }, error: (err) => {
            if (err.status === 400) {
              for (const [key, value] of Object.entries(err.error)) {
                this.errors = [...this.errors, { key, value }];
              }
            }
          }
        }
      );
  }

  openConatcModalListener() {
    this.messagesService.openContactModal$.subscribe({
      next: recipent => {
        if (recipent) {
          this.recepientId = recipent;
          this.showContactModal = true;
        }
      }
    })
  }

  openConatcModal(event: any) {
    this.recepientId = null;
    this.showContactModal = event
  }

  onResize(e?: any) {
    cloneHeader();
  }
}
