import { TestBed } from '@angular/core/testing';

import { EndorsereportService } from './endorsereport.service';

describe('EndorsereportService', () => {
  let service: EndorsereportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndorsereportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
