import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAthleteComponent } from './register-athlete.component';

describe('RegisterAthleteComponent', () => {
  let component: RegisterAthleteComponent;
  let fixture: ComponentFixture<RegisterAthleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterAthleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
