import { TestBed } from '@angular/core/testing';

import { PoliceDashbordService } from './police-dashbord.service';

describe('PoliceDashbordService', () => {
  let service: PoliceDashbordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliceDashbordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
