import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatDetailsModalComponent } from './stat-details-modal.component';

describe('StatDetailsModalComponent', () => {
  let component: StatDetailsModalComponent;
  let fixture: ComponentFixture<StatDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
