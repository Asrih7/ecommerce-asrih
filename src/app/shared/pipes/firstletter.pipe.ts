
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'firstletter'
})
export class FirstLetterPipe implements PipeTransform {
    transform(value: string, args?: any[]): string {
        if (!value) { return ''; }
        return value.split('')[0];
    }
}
