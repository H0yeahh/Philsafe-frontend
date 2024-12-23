import { TestBed } from '@angular/core/testing';

import { PoliceOfficerService } from './police-officer.service';

describe('PoliceOfficerService', () => {
  let service: PoliceOfficerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliceOfficerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
