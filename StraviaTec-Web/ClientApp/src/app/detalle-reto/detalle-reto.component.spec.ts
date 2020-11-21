import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleRetoComponent } from './detalle-reto.component';

describe('DetalleRetoComponent', () => {
  let component: DetalleRetoComponent;
  let fixture: ComponentFixture<DetalleRetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleRetoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleRetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
