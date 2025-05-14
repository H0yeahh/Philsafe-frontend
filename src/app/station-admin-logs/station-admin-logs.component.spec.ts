import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminLogsComponent } from './station-admin-logs.component';

describe('StationAdminLogsComponent', () => {
  let component: StationAdminLogsComponent;
  let fixture: ComponentFixture<StationAdminLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationAdminLogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationAdminLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
