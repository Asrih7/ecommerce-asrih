import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replace'
})
export class ReplacePipe implements PipeTransform {
    transform(value: string): string {
        return value ? value.replace(/,/g, '.') : value;
    }
}
