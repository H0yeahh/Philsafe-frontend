import { TestBed } from '@angular/core/testing';

import { StationListOfOfficersService } from './station-list-of-officers.service';

describe('StationListOfOfficersService', () => {
  let service: StationListOfOfficersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationListOfOfficersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
