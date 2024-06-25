import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { DEFAULT_DISPLAY_DATE_FORMAT } from '../../app.constants';

@Pipe({
  name: 'isoDateToString',
  standalone: true
})
export class IsoDateToStringPipe implements PipeTransform {
  transform(value: string | undefined, format: string = DEFAULT_DISPLAY_DATE_FORMAT): string {
    if(!value) return '';
    return DateTime.fromISO(value).toFormat(format);
  }
}
