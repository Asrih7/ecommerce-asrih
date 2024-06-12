import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'choiceLabel'
})
export class ChoiceLabelPipe implements PipeTransform {
    transform(list: any[], countryCode: string): string {
        return (list ?? []).find(x => x.value == countryCode)?.display_name;
    }
}
