import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractValue',
  standalone: true
})
export class ExtractValuePipe implements PipeTransform {

  transform(value: any, path: string): any {
    if (!value || !path) {
      return null;
    }
    const keys = path.split('.');
    let result = value;
    for (const key of keys) {
      if (result[key] !== undefined) {
        result = result[key];
      } else {
        return null;
      }
    }
    return result;
  }
}
