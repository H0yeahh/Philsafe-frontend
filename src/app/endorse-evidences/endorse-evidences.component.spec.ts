import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorseEvidencesComponent } from './endorse-evidences.component';

describe('EndorseEvidencesComponent', () => {
  let component: EndorseEvidencesComponent;
  let fixture: ComponentFixture<EndorseEvidencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndorseEvidencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EndorseEvidencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
