import { TestBed } from '@angular/core/testing';

import { AddCaseService } from './add-case.service';

describe('AddCaseService', () => {
  let service: AddCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
