import { TestBed } from '@angular/core/testing';

import { CreateCasesService } from './create-cases.service';

describe('CreateCasesService', () => {
  let service: CreateCasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
