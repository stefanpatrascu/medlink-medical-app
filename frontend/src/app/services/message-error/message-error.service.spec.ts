import { TestBed } from '@angular/core/testing';

import { MessageErrorService } from './message-error.service';

describe('MessageErrorService', () => {
  let service: MessageErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
