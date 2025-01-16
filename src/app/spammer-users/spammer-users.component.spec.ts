import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpammerUsersComponent } from './spammer-users.component';

describe('SpammerUsersComponent', () => {
  let component: SpammerUsersComponent;
  let fixture: ComponentFixture<SpammerUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpammerUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpammerUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
