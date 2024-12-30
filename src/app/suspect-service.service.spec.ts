import { TestBed } from '@angular/core/testing';

import { SuspectServiceService } from './suspect-service.service';

describe('SuspectServiceService', () => {
  let service: SuspectServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuspectServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
