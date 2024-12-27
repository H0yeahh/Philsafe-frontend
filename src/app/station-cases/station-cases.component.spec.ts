import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationCasesComponent } from './station-cases.component';

describe('StationCasesComponent', () => {
  let component: StationCasesComponent;
  let fixture: ComponentFixture<StationCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationCasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
