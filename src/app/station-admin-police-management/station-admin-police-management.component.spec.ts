import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminPoliceManagementComponent } from './station-admin-police-management.component';

describe('StationAdminPoliceManagementComponent', () => {
  let component: StationAdminPoliceManagementComponent;
  let fixture: ComponentFixture<StationAdminPoliceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationAdminPoliceManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationAdminPoliceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
