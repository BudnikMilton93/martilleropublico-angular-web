import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Propiedad } from '../../models/propiedades/propiedad.models';
import { PropiedadesService } from '../../services/propiedades/propiedades.service';
import { CommonModule } from '@angular/common';
import { animateOnScroll } from '../../shared/utils/animations';

@Component({
  selector: 'app-propiedades-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './propiedades-menu.component.html',
  styleUrls: ['./propiedades-menu.component.scss'] 
})
export class PropiedadesMenuComponent implements OnInit, AfterViewInit  {
  propiedades: Propiedad[] = [];
  cargando = true;

  constructor(private el: ElementRef, private propiedadesService: PropiedadesService) { }

  ngOnInit(): void {
    this.propiedadesService.getPropiedades().subscribe({
      next: (data) => {
        this.propiedades = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  ngAfterViewInit(): void {
    try {
      this.ActivarAnimacion();
    } catch (error) {
      throw error;
    }
  }

  ActivarAnimacion() {
    const section = this.el.nativeElement.querySelector('#propiedadesMenu-section');
    animateOnScroll(section);
  }
}

 