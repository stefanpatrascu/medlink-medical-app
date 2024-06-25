import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class SaveFileService {

  saveFile(response: HttpResponse<Blob>): void {
    if (response.body) {
      let fileName: string = 'no_name_defined';
      const contentDisposition: string | null = response.headers.get('content-disposition');

      if (contentDisposition) {
        const fileNameRegex: RegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches: RegExpExecArray | null = fileNameRegex.exec(contentDisposition);
        if (matches?.[1]) {
          fileName = matches[1].replace(/['"]/g, '');
        }
      }

      saveAs(response.body, fileName);
    }
  }

}
