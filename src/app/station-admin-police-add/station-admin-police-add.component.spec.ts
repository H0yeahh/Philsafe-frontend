import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminPoliceAddComponent } from './station-admin-police-add.component';

describe('StationAdminPoliceAddComponent', () => {
  let component: StationAdminPoliceAddComponent;
  let fixture: ComponentFixture<StationAdminPoliceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationAdminPoliceAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationAdminPoliceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
