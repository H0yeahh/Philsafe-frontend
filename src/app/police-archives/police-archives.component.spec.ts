import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceArchivesComponent } from './police-archives.component';

describe('PoliceArchivesComponent', () => {
  let component: PoliceArchivesComponent;
  let fixture: ComponentFixture<PoliceArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliceArchivesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
