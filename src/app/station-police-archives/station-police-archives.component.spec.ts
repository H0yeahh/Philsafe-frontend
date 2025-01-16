import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationPoliceArchivesComponent } from './station-police-archives.component';

describe('StationPoliceArchivesComponent', () => {
  let component: StationPoliceArchivesComponent;
  let fixture: ComponentFixture<StationPoliceArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationPoliceArchivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationPoliceArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
