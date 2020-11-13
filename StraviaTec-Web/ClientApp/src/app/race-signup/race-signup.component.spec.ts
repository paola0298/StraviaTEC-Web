import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceSignupComponent } from './race-signup.component';

describe('RaceSignupComponent', () => {
  let component: RaceSignupComponent;
  let fixture: ComponentFixture<RaceSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaceSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
