import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Provedor } from './provedor';

describe('Provedor', () => {
  let component: Provedor;
  let fixture: ComponentFixture<Provedor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Provedor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Provedor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
