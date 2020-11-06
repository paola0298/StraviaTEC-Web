import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAfiliacionesComponent } from './gestion-afiliaciones.component';

describe('GestionAfiliacionesComponent', () => {
  let component: GestionAfiliacionesComponent;
  let fixture: ComponentFixture<GestionAfiliacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionAfiliacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAfiliacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
