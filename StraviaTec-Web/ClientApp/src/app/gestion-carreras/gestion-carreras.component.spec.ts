import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCarrerasComponent } from './gestion-carreras.component';

describe('GestionCarrerasComponent', () => {
  let component: GestionCarrerasComponent;
  let fixture: ComponentFixture<GestionCarrerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionCarrerasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
