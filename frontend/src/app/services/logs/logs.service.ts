import { Injectable } from '@angular/core';
import { IGenericGridApiRequest } from '@interfaces/grid/generic-grid-api-request.interface';
import { Observable } from 'rxjs';
import { GenericApiResponse } from '@interfaces/grid/generic-grid-api-response.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { LogsPathEnum } from '@enums/logs/logs-path.enum';
import { ILog } from '@interfaces/logs/log.interface';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  private path: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getAllLogs(request: IGenericGridApiRequest): Observable<GenericApiResponse<ILog>> {
    return this.http.post<GenericApiResponse<ILog>>(`${this.path}/${LogsPathEnum.LOGS}/${LogsPathEnum.ALL}`,
      request
    );
  }

}
