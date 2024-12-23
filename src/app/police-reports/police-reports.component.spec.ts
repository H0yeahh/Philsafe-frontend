import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceReportsComponent } from './police-reports.component';

describe('PoliceReportsComponent', () => {
  let component: PoliceReportsComponent;
  let fixture: ComponentFixture<PoliceReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliceReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
