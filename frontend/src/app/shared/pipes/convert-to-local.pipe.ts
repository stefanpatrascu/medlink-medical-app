import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { DEFAULT_DISPLAY_DATE_FORMAT } from '../../app.constants';
import { environment } from '@environment/environment';

@Pipe({
  name: 'convertToLocal',
  standalone: true
})
export class ConvertToLocalPipe implements PipeTransform {
  transform(value: string | undefined, format: string = DEFAULT_DISPLAY_DATE_FORMAT): string {
    if(!value) return '';
    if (environment.profile === 'dev' || environment.profile === 'prod') {
      // because the server are running in UTC, we need to convert the date to local
      return DateTime.fromISO(value, {zone: 'UTC'}).toLocal().toFormat(format);
    }
    return DateTime.fromISO(value).toFormat(format);
  }
}
