import { AfterViewInit, Component,ElementRef } from '@angular/core';
import { IPropiedades } from '../../models/propiedades/propiedades.models';
import { PROPIEDADES_MOCK } from '../../mocks/propiedades/propiedades.mock';
import { CommonModule } from '@angular/common'
import { TarjetaComponent } from '../tarjeta/tarjeta/tarjeta.component';
import { TarjetaDetallesComponent } from '../tarjeta-detalles/tarjeta-detalles/tarjeta-detalles.component';
import { animateOnScroll } from '../../shared/utils/animations';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-propiedades',
  standalone: true,
  imports: [CommonModule, TarjetaComponent, TarjetaDetallesComponent, FontAwesomeModule],
  templateUrl: './propiedades.component.html',
  styleUrl: './propiedades.component.scss'
})
export class PropiedadesComponent implements AfterViewInit{
  
  constructor(private el: ElementRef, library: FaIconLibrary) {
    library.addIcons(faCalculator);
  }

  //#region Eventos
  ngAfterViewInit(): void {
    try {
      this.ActivarAnimacion();
    } catch (error) {
      throw error;
    }
  }
  //#endregion
  
  //#region Variables
  propiedades: IPropiedades[] = PROPIEDADES_MOCK;
  propiedadSeleccionada: IPropiedades | null = null;

  faCalculator = faCalculator;

  //#endregion

  //#region Procedimientos
  OpenModal(propiedad: IPropiedades) {
    this.propiedadSeleccionada = propiedad;
  }

  ActivarAnimacion() {
    const section = this.el.nativeElement.querySelector('#propiedades-section');
    animateOnScroll(section);
  }

  //#endregion
  
}
