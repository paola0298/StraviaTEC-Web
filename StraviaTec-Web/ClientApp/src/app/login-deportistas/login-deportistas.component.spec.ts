import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDeportistasComponent } from './login-deportistas.component';

describe('LoginDeportistasComponent', () => {
  let component: LoginDeportistasComponent;
  let fixture: ComponentFixture<LoginDeportistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginDeportistasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDeportistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
