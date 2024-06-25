import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { IMessageErrorResponse } from '@interfaces/message-error-response.interface';
import { ERROR_MESSAGES_EN } from '../../constants/error.constant';

@Injectable({
  providedIn: 'root'
})
export class MessageErrorService {

  #errorMessagesMap: Map<string, string> = new Map<string, string>(ERROR_MESSAGES_EN);

  messageError: Subject<IMessageErrorResponse> = new Subject<IMessageErrorResponse>();

  setMessageError(message: any) {
    if (message.status === undefined) {
      return;
    }
    this.messageError.next(message);
  }

  getMessageError(): Observable<IMessageErrorResponse> {
    return this.messageError.asObservable().pipe(
      map((message: any): IMessageErrorResponse => this.errorMapping(message)));
  }

  errorMapping(error: any): IMessageErrorResponse {
    return {
      title: 'Error',
      status: error.status,
      message: this.errorMappingMessage(error.status, error.error.message)
    }
  }

  errorMappingMessage(code: number, message: string | undefined | null): string {
    if (message === undefined || message === null) {
      switch (code) {
        case 400:
          message = 'Bad Request';
          break;
        case 404:
          message = 'Not Found';
          break;
        case 500:
        case 409:
          message = 'Internal Server Error';
          break;
        default:
          message = 'Unknown Error';
          break;
      }
      return message;
    }

    if (this.#errorMessagesMap.has(message)) {
      return this.#errorMessagesMap.get(message) as string;
    }

    return message;
  }
}
