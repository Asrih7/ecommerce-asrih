import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { RegionalSettings } from 'src/@core/models/regionalSettings';
import { ConsentComponent } from 'src/app/features/legal/consent/consent.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnChanges {
  @Input() listFields: any[] = [];
  @Input() settings?: RegionalSettings;
  @Output() contactClicked = new EventEmitter<boolean>();
  @Output() showSettingsModal = new EventEmitter<boolean>();
  @ViewChild(ConsentComponent) cookiesComponent: ConsentComponent;

  public year = new Date().getFullYear();
  public showContact: boolean = false;
  public country: string;
  public language: string;
  public currency: string;
  public flag: string;

  ngOnChanges(): void {
    if (this.listFields?.length && this.settings) {
      for (const field of this.listFields ?? []) {
        switch (field.key) {
          case 'language':
            this.language = this.getSettingsItem(field.value.choices, 'language');
            this.flag = this.settings.language;
            break;
          case 'currency':
            this.currency = this.getSettingsItem(field.value.choices, 'currency');
            break;
          case 'country':
            this.country = this.getSettingsItem(field.value.choices, 'country');
            break;
        }
      }
    }
  }

  getSettingsItem(list: any[], key: string): string {
    const selected = list.find((c: any) => c.value == (this.settings as any)[key]);
    return selected?.display_name;
  }

  showModalContact() {
    this.showContact = !this.showContact;
    this.contactClicked.emit(this.showContact);
  }

  showModal(): any {
    this.showSettingsModal.emit(true);
  }

  showCookie() {
    this.cookiesComponent.showCookie = true;
  }
}
