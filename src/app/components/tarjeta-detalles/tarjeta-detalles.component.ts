import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common'
import { faXmark, faChevronLeft, faChevronRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Propiedad } from '../../models/propiedades/propiedad.models';

@Component({
  selector: 'app-tarjeta-detalles',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './tarjeta-detalles.component.html',
  styleUrl: './tarjeta-detalles.component.scss'
})
export class TarjetaDetallesComponent implements OnChanges {

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

  get resumenTipo(): string {
    switch (this.data?.tipoId) {
      case 1:
        return `Superficie construida y del terreno: ${this.data.superficieResumen ?? ''}`;
      case 2:
        return `Superficie total: ${this.data.superficieResumen ?? ''}`;
      case 3:
        return this.data.vehiculoResumen ?? '';
      case 4:
        return this.data.alquilerResumen ?? '';
      default:
        return '';
    }
  }
  //#endregion


  //#region Inputs
  @Input() data!: Propiedad;
  @Output() closeRequested = new EventEmitter<void>();
  //#endregion

  ngOnChanges() {
    this.currentImage = 0;
  }

  //#region Procedimientos
  ImagenSiguiente() {
    if (this.data?.fotos.length) {
      this.currentImage = (this.currentImage + 1) % this.data.fotos.length;
    }
  }

  ImagenAnterior() {
    if (this.data?.fotos.length) {
      this.currentImage = (this.currentImage - 1 + this.data.fotos.length) % this.data.fotos.length;
    }
  }

  Cerrar() {
    this.data = undefined!;
  }
  //#endregion


}
