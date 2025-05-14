import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminCitizensManagementComponent } from './station-admin-citizens-management.component';

describe('StationAdminCitizensManagementComponent', () => {
  let component: StationAdminCitizensManagementComponent;
  let fixture: ComponentFixture<StationAdminCitizensManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationAdminCitizensManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationAdminCitizensManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
