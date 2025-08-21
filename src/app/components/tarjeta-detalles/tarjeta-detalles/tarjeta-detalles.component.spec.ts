import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDetallesComponent } from './tarjeta-detalles.component';

describe('TarjetaDetallesComponent', () => {
  let component: TarjetaDetallesComponent;
  let fixture: ComponentFixture<TarjetaDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaDetallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarjetaDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
