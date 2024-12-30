import { TestBed } from '@angular/core/testing';

import { CrimeServiceService } from './crime-service.service';

describe('CrimeServiceService', () => {
  let service: CrimeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrimeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
