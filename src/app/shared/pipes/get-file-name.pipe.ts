import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getFileName'
})
export class GetFileNamePipe implements PipeTransform {

    transform(value: string, args?: any[]): string {
        if (!value) { return ''; }
        return value.split('file/')[1];
    }

}
