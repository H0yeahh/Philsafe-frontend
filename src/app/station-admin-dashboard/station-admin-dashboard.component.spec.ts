import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminDashboardComponent } from './station-admin-dashboard.component';

describe('StationAdminDashboardComponent', () => {
  let component: StationAdminDashboardComponent;
  let fixture: ComponentFixture<StationAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationAdminDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
