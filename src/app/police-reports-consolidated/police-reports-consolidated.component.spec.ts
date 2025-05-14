import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceReportsConsolidatedComponent } from './police-reports-consolidated.component';

describe('PoliceReportsConsolidatedComponent', () => {
  let component: PoliceReportsConsolidatedComponent;
  let fixture: ComponentFixture<PoliceReportsConsolidatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliceReportsConsolidatedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceReportsConsolidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
