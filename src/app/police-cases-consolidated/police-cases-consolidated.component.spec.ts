import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceCasesConsolidatedComponent } from './police-cases-consolidated.component';

describe('PoliceCasesConsolidatedComponent', () => {
  let component: PoliceCasesConsolidatedComponent;
  let fixture: ComponentFixture<PoliceCasesConsolidatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliceCasesConsolidatedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceCasesConsolidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
