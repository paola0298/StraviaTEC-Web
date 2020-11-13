import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRetosComponent } from './gestion-retos.component';

describe('GestionRetosComponent', () => {
  let component: GestionRetosComponent;
  let fixture: ComponentFixture<GestionRetosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionRetosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionRetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
