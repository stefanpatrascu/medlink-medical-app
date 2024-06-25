import { ErrorHandler, Injectable } from '@angular/core';
import { MessageErrorService } from '@services/message-error/message-error.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private messageError: MessageErrorService) {
  }

  handleError(error: any): void {
    console.error('Error: ', error);
    this.messageError.setMessageError(error);
  }
}
