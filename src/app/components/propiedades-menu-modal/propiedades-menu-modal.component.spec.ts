import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropiedadesMenuModalComponent } from './propiedades-menu-modal.component';

describe('PropiedadesMenuModalComponent', () => {
  let component: PropiedadesMenuModalComponent;
  let fixture: ComponentFixture<PropiedadesMenuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropiedadesMenuModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropiedadesMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
