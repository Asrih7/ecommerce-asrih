import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGeneric } from 'src/@core/models/form-generic';
import { REGIONAL_SETTINGS_FORM } from 'src/@core/models/form.model';
import { RegionalSettings } from 'src/@core/models/regionalSettings';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';

@Component({
  selector: 'app-modal-settings',
  templateUrl: './modal-settings.component.html',
  styleUrls: ['./modal-settings.component.scss']
})
export class ModalSettingsComponent implements OnChanges {
  @Input() modal: boolean;
  @Input() listFields: any[] = [];
  @Input() settings?: RegionalSettings;
  @Input() errors: any = [];
  @Output() settingsChanged: EventEmitter<RegionalSettings> = new EventEmitter();

  public languageList: any[] = [];
  public searchedLanguages: any = [];
  public currencyList: any[] = [];
  public searchedCurrency: any = [];
  public countryList: any[] = [];
  public searchedCountry: any = [];
  public form: any;

  constructor(
    private fb: FormBuilder,
    private settingsService: RegionalSettingsService
  ) {
    this.form = new FormGeneric(fb);
    this.form.group = this.fb.group(REGIONAL_SETTINGS_FORM);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.listFields?.length && this.settings)
      this.constructSettingsForm();
  }

  constructSettingsForm() {
    for (const field of this.listFields ?? []) {
      switch (field.key) {
        case 'language':
          this.languageList = field.value.choices;
          this.searchedLanguages = [...this.languageList];
          this.setSettingsItem(this.languageList, 'language');
          break;
        case 'currency':
          this.currencyList = field.value.choices;
          this.searchedCurrency = [...this.currencyList];
          this.setSettingsItem(this.currencyList, 'currency');
          break;
        case 'country':
          this.countryList = field.value.choices;
          this.searchedCountry = [...this.countryList];
          this.setSettingsItem(this.countryList, 'country');
          break;
      }
    }
  }

  setSettingsItem(list: any[], key: string): void {
    if (list?.length) {
      const selected = list.find((c: any) => c.value == (this.settings as any)[key]);
      this.form.group.get(key).setValue(selected?.value);
    }
  }

  displayLangFn(lang?: any): string {
    let value: any;
    if (this.languageList) {
      value = this.languageList.find((item: any) => item.value == lang)
    }

    return value ? value.display_name : "";
  }

  displayCountFn(count?: any): string {
    let value: any;
    if (this.countryList) {
      value = this.countryList.find((item: any) => item.value == count)
    }

    return value ? value.display_name : "";
  }

  displayCurrFn(curr?: any): string {
    let value: any;
    if (this.currencyList) {
      value = this.currencyList.find((item: any) => item.value == curr)
    }

    return value ? value.display_name : "";
  }

  selectSettingsItem(key: string, event: any) {
    this.form.group.get(key).setValue(event.option.value)
  }

  searchLanguage(event: any) {
    this.searchedLanguages = this.languageList.filter((item: any) => item.display_name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  searchCurency(event: any) {
    this.searchedCurrency = this.currencyList.filter((item: any) => item.display_name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  searchCountry(event: any) {
    this.searchedCountry = this.countryList.filter((item: any) => item.display_name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  updateSettings(): any {
    let settings: any = {};
    this.form.assign(settings);
    this.settingsChanged.emit(settings);
  }
}
