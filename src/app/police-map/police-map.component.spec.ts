import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceMapComponent } from './police-map.component';

describe('PoliceMapComponent', () => {
  let component: PoliceMapComponent;
  let fixture: ComponentFixture<PoliceMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliceMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
