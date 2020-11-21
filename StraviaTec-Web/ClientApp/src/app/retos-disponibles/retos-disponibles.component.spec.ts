import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetosDisponiblesComponent } from './retos-disponibles.component';

describe('RetosDisponiblesComponent', () => {
  let component: RetosDisponiblesComponent;
  let fixture: ComponentFixture<RetosDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetosDisponiblesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetosDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
