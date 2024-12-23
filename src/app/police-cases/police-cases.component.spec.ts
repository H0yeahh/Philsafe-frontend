import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceCasesComponent } from './police-cases.component';

describe('PoliceCasesComponent', () => {
  let component: PoliceCasesComponent;
  let fixture: ComponentFixture<PoliceCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliceCasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
