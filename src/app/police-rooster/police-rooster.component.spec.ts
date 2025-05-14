import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceRoosterComponent } from './police-rooster.component';

describe('PoliceRoosterComponent', () => {
  let component: PoliceRoosterComponent;
  let fixture: ComponentFixture<PoliceRoosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliceRoosterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceRoosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
