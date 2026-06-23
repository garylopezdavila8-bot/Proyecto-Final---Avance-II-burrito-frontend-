import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Afinidad } from './afinidad';

describe('Afinidad', () => {
  let component: Afinidad;
  let fixture: ComponentFixture<Afinidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Afinidad],
    }).compileComponents();

    fixture = TestBed.createComponent(Afinidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
