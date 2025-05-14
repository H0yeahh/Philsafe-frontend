import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminReportsManagementComponent } from './station-admin-reports-management.component';

describe('StationAdminReportsManagementComponent', () => {
  let component: StationAdminReportsManagementComponent;
  let fixture: ComponentFixture<StationAdminReportsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationAdminReportsManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationAdminReportsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
