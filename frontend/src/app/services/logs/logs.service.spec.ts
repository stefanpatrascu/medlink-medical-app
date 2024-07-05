import { TestBed } from '@angular/core/testing';

import { LogsService } from './logs.service';
import { provideHttpClient } from '@angular/common/http';

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ]
    });
    service = TestBed.inject(LogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
