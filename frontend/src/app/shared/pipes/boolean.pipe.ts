import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToString',
  standalone: true
})
export class BooleanToStringPipe implements PipeTransform {
  transform(value: string | undefined | boolean): string {
    if (Boolean(value) === true) return 'Yes';
    return 'No';
  }
}
