import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationGeoanalysisComponent } from './station-geoanalysis.component';

describe('StationGeoanalysisComponent', () => {
  let component: StationGeoanalysisComponent;
  let fixture: ComponentFixture<StationGeoanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationGeoanalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationGeoanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
