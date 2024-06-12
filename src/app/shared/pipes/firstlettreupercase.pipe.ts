import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'firstletterupper'
})
export class FirstletterupperPipe implements PipeTransform {

    transform(word: string, ...args: unknown[]): string {
        if (!word) {
            return word;
        } else {
            return word[0].toUpperCase() + word.substr(1).toLowerCase();
        }
    }

}