import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAthleteComponent } from './profile-athlete.component';

describe('ProfileAthleteComponent', () => {
  let component: ProfileAthleteComponent;
  let fixture: ComponentFixture<ProfileAthleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileAthleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
