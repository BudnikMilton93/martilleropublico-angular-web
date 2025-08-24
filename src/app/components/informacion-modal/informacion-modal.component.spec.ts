import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionModalComponent } from './informacion-modal.component';

describe('InformacionModalComponent', () => {
  let component: InformacionModalComponent;
  let fixture: ComponentFixture<InformacionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
