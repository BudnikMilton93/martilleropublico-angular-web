import { Component, EventEmitter, Input, Output  } from '@angular/core';
import { CommonModule } from '@angular/common'
import { faXmark, faChevronLeft, faChevronRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Propiedad } from '../../../models/propiedades/propiedad.models';

@Component({
  selector: 'app-tarjeta-detalles',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './tarjeta-detalles.component.html',
  styleUrl: './tarjeta-detalles.component.scss'
})
export class TarjetaDetallesComponent {

  constructor(library: FaIconLibrary) {
  library.addIcons(faXmark, faChevronLeft, faChevronRight, faMapMarkerAlt, faWhatsapp);
  }

  //#region Variables
  faXmark = faXmark;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faMapMarkerAlt = faMapMarkerAlt;
  faWhatsapp = faWhatsapp;
  currentImage = 0;
  //#endregion


  //#region Inputs
  @Input() data!: Propiedad;
  @Output() closeRequested = new EventEmitter<void>();
  //#endregion

  //#region Procedimientos
  ImagenSiguiente() {
    if (this.data?.imagenes.length) {
      this.currentImage = (this.currentImage + 1) % this.data.imagenes.length;
    }
  }

  ImagenAnterior() {
    if (this.data?.imagenes.length) {
      this.currentImage = (this.currentImage - 1 + this.data.imagenes.length) % this.data.imagenes.length;
    }
  }

  Cerrar() {
    this.data = undefined!;
  }
  //#endregion

  
}
