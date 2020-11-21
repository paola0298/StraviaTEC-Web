import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetoDetalleComponent } from './reto-detalle.component';

describe('RetoDetalleComponent', () => {
  let component: RetoDetalleComponent;
  let fixture: ComponentFixture<RetoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetoDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
