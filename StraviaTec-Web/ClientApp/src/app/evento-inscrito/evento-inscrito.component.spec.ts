import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoInscritoComponent } from './evento-inscrito.component';

describe('EventoInscritoComponent', () => {
  let component: EventoInscritoComponent;
  let fixture: ComponentFixture<EventoInscritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventoInscritoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventoInscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
