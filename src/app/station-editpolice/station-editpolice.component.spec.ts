import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationEditpoliceComponent } from './station-editpolice.component';

describe('StationEditpoliceComponent', () => {
  let component: StationEditpoliceComponent;
  let fixture: ComponentFixture<StationEditpoliceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationEditpoliceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationEditpoliceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
