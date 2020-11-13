import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPatrocinadoresComponent } from './gestion-patrocinadores.component';

describe('GestionPatrocinadoresComponent', () => {
  let component: GestionPatrocinadoresComponent;
  let fixture: ComponentFixture<GestionPatrocinadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPatrocinadoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPatrocinadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
