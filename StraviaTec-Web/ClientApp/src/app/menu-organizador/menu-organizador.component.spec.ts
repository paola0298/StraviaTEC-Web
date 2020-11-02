import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOrganizadorComponent } from './menu-organizador.component';

describe('MenuOrganizadorComponent', () => {
  let component: MenuOrganizadorComponent;
  let fixture: ComponentFixture<MenuOrganizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuOrganizadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOrganizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
