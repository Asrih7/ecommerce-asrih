import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

registerLocaleData(localeFr, 'fr');

@Pipe({
    name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {

    constructor(private translateService: TranslateService) {
    }

    transform(value: any, pattern: string = 'shortDate'): any {
        const datePipe = new DatePipe('fr');
        return datePipe.transform(value, pattern);
    }

}
