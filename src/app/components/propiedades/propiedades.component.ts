import { AfterViewInit, Component,ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { TarjetaComponent } from '../tarjeta/tarjeta.component';
import { TarjetaDetallesComponent } from '../tarjeta-detalles/tarjeta-detalles.component';
import { animateOnScroll } from '../../shared/utils/animations';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Propiedad } from '../../models/propiedades/propiedad.models';
import { PropiedadesService } from '../../services/propiedades/propiedades.service';


@Component({
  selector: 'app-propiedades',
  standalone: true,
  imports: [CommonModule, TarjetaComponent, TarjetaDetallesComponent, FontAwesomeModule],
  templateUrl: './propiedades.component.html',
  styleUrl: './propiedades.component.scss'
})
export class PropiedadesComponent implements AfterViewInit, OnInit {
  
  constructor(private el: ElementRef, library: FaIconLibrary, private propiedadesService: PropiedadesService) {
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

  ngOnInit(): void {
    try {
       this.CargarPropiedades();
    } catch (error) {
      throw error;
    }
  }
  //#endregion
  
  //#region Variables
  propiedades: Propiedad[] = [];
  propiedadSeleccionada: Propiedad | null = null;

  faCalculator = faCalculator;

  //#endregion

  //#region Procedimientos
  OpenModal(propiedad: Propiedad) {
    this.propiedadSeleccionada = propiedad;
  }

  CargarPropiedades() {
    this.propiedadesService.getPropiedades().subscribe({
      next: (data) => this.propiedades = data,
      error: (err) => console.error('Error cargando propiedades', err)
    });
  }

  ActivarAnimacion() {
    const section = this.el.nativeElement.querySelector('#propiedades-section');
    animateOnScroll(section);
  }

  // CargarImagenesPropiedad() {
  //   this.propiedades.forEach((prop, index) => {
  //     this.BuscarImagenesPropiedad(prop, index);
  //   });
  // }

  // private BuscarImagenesPropiedad(prop: IPropiedades, index: number) {
  //   fetch(`assets/images/propiedades/venta-ChosMalal-elCanalito/ventaChosMalalElCanalito.json`)
  //     .then(res => res.json())
  //     .then(data => {
  //       this.propiedades[index].imagenes = data.imagenes.map(
  //         (img: string) => `assets/images/propiedades/venta-ChosMalal-elCanalito/${img}`
  //       );
  //     });
  // }

  //#endregion
  
}
