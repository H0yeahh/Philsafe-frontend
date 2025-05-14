import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceStationsComponent } from './police-stations.component';

describe('PoliceStationsComponent', () => {
  let component: PoliceStationsComponent;
  let fixture: ComponentFixture<PoliceStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliceStationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
