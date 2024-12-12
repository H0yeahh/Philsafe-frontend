import { TestBed } from '@angular/core/testing';

import { ManageStationService } from './manage-station.service';

describe('ManageStationService', () => {
  let service: ManageStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
