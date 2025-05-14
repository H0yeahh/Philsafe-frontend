import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationCitizensComponent } from './station-citizens.component';

describe('StationCitizensComponent', () => {
  let component: StationCitizensComponent;
  let fixture: ComponentFixture<StationCitizensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationCitizensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationCitizensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
