import { TestBed } from '@angular/core/testing';

import { ClinicService } from './clinic.service';
import { HttpClientModule } from '@angular/common/http';

describe('ClinicService', () => {
  let service: ClinicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ClinicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
