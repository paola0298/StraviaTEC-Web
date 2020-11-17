import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociarseGrupoComponent } from './asociarse-grupo.component';

describe('AsociarseGrupoComponent', () => {
  let component: AsociarseGrupoComponent;
  let fixture: ComponentFixture<AsociarseGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsociarseGrupoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsociarseGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
