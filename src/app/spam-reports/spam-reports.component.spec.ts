import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpamReportsComponent } from './spam-reports.component';

describe('SpamReportsComponent', () => {
  let component: SpamReportsComponent;
  let fixture: ComponentFixture<SpamReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpamReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpamReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
