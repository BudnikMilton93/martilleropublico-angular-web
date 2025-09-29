import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropiedadesMenuComponent } from './propiedades-menu.component';

describe('PropiedadesMenuComponent', () => {
  let component: PropiedadesMenuComponent;
  let fixture: ComponentFixture<PropiedadesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropiedadesMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropiedadesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
